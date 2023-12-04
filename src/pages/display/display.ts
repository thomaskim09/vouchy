import lo_isEmpty from 'lodash/isEmpty';
import { AuthenticationService } from '../../providers/authentication/authentication.service';
import { Component } from '@angular/core';
import { DataService } from '../../providers/data-service/data.service';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserService } from '../../providers/user/user.service';
import { formatDistanceStrict, parseISO } from 'date-fns';
import { untilDestroyed } from 'ngx-take-until-destroy';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-display',
  templateUrl: 'display.html',
})
export class DisplayPage {

  // Params received
  type: string;
  // Feedbacks params
  voucherId: string;
  restaurantId: string;
  // Notifications params
  hasNotifications: boolean;

  // notification properties
  colorList = ['#eccc68', '#ff7f50', '#ff6b81', '#a4b0be', '#57606f', '#ffa502', '#ff6348', '#747d8c', '#70a1ff', '#2ed573', '#1e90ff'];

  // HTML properties
  title: string;

  // Common properties
  currentUser: any;

  // Input to child components
  feedback: any;
  notifications: any = [];
  restaurantsList: any = [];

  // Infinite scroll
  pageNum: number = 1;
  pageSize: number = 10;
  needInfiniteScroll: boolean = true;

  constructor(
    public authenticationService: AuthenticationService,
    public dataService: DataService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserService) { }

  ngOnInit() {
    this.type = this.navParams.get('type');
    this.restaurantId = this.navParams.get('restaurantId');
    this.voucherId = this.navParams.get('voucherId');
    this.hasNotifications = this.navParams.get('hasNotifications');
    this.currentUser = this.authenticationService.currentUserValue;
    this.setUpEachContent(this.type, 1);
    this.listenToggleInfiniteScroll();
    this.title = this.getTitle(this.type);
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private setUpEachContent(type, pNum, infiniteScroll?) {
    switch (type) {
      case 'feedback': {
        this.feedback = {
          type: this.voucherId ? 'voucher' : 'restaurant',
          id: this.voucherId || this.restaurantId,
          pageSize: this.pageSize,
          pageNum: pNum,
          infiniteScroll: infiniteScroll
        };
        break;
      }
      case 'notification': {
        this.userService.getNotification(this.currentUser._id, 'F', this.pageSize, pNum, this.hasNotifications).pipe(untilDestroyed(this)).subscribe(val => {
          const result = this.processNotification(val, this.hasNotifications);
          this.notifications = [...this.notifications, ...result];
          this.checkListFinish(val, infiniteScroll);
        });
        break;
      }
      case 'favourite': {
        const favourites = this.currentUser.favourites;
        if (!lo_isEmpty(favourites)) {
          const skips = this.pageSize * (pNum - 1);
          const list = favourites.slice(0).splice(skips, this.pageSize);
          this.userService.getFavourites(list).pipe(untilDestroyed(this)).subscribe(val => {
            this.restaurantsList = [...this.restaurantsList, ...val];
            this.checkListFinish(val, infiniteScroll);
          });
        }
        break;
      }
    }
  }

  private listenToggleInfiniteScroll() {
    this.dataService.currentInfiniteTrigger.pipe(untilDestroyed(this)).subscribe(val => {
      if (!lo_isEmpty(val)) {
        this.needInfiniteScroll = val.needInfiniteScroll;
        this.pageNum = val.pageNum;
      }
    });
  }

  loadMore(infiniteScroll) {
    this.setUpEachContent(this.type, this.pageNum, infiniteScroll);
  }

  private checkListFinish(val, infiniteScroll?) {
    if (infiniteScroll) {
      infiniteScroll.complete();
    }
    if (val.length < this.pageSize) {
      this.pageNum = 1;
      this.needInfiniteScroll = false;
    } else {
      this.pageNum++;
      this.needInfiniteScroll = true;
    }
  }

  private getTitle(type) {
    switch (type) {
      case 'feedback': return `Customer's Feedbacks`;
      case 'notification': return 'Notifications';
      case 'favourite': return 'Favourites';
    }
  }

  private processNotification(list, refresh) {
    if (refresh) {
      this.notifications = [];
    }
    return list.map(val => ({
      title: val.title,
      body: val.body,
      bgColor: this.getBgColor(val.title),
      char: this.getChar(val.title),
      time: this.getTime(val.createdTime),
      isRead: val.isRead
    }));
  }

  private getBgColor(title) {
    const charCodeArray = String(title.charCodeAt(0)).split('');
    const numberArray = charCodeArray.map(val => Number(val));
    const result = numberArray.reduce((a, c) => a + c, 0);
    const output = Math.round(parseFloat('0.' + result) * this.colorList.length);
    return this.colorList[output];
  }

  private getChar(title) {
    return (title.charAt(0)).toUpperCase();
  }

  private getTime(time) {
    return this.setUpLocale(formatDistanceStrict(parseISO(time), new Date()));
  }

  private setUpLocale(time: string) {
    const timeString = time.split(' ');
    let result = '';
    timeString.map(val => result += (+val === +val) ? val : timeFormat(val) + ' ');
    function timeFormat(word) {
      switch (word) {
        case 'seconds': case 'second': return 's';
        case 'minutes': case 'minute': return 'm';
        case 'hours': case 'hour': return 'h';
        case 'days': case 'day': return 'd';
        case 'months': case 'month': return 'M';
        case 'years': case 'year': return 'Y';
        default: return '';
      }
    }
    return result;
  }

  back() {
    this.navCtrl.pop();
  }
}
