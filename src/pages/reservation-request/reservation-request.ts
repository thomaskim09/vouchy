import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthenticationService } from './../../providers/authentication/authentication.service';
import { UserService } from '../../providers/user/user.service';
import { formatDistanceStrict, parseISO } from 'date-fns';
import { untilDestroyed } from 'ngx-take-until-destroy';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-reservation-request',
  templateUrl: 'reservation-request.html',
})
export class ReservationRequestPage {

  currentUser: any;
  requests: any = [];
  colorList = {
    green: '#2ed573',
    grey: '#c4c1c1',
    darkGrey: '#8e8e8e',
    yellow: '#ffa502',
    red: '#ff7f50',
    blue: '#00a8ff'
  };

  // Infinite scroll
  pageNum: number = 1;
  pageSize: number = 10;
  needInfiniteScroll: boolean = true;

  constructor(
    public authenticationService: AuthenticationService,
    public userService: UserService,
    public navCtrl: NavController,
    public navParams: NavParams) { }

  ngOnInit() {
    this.currentUser = this.authenticationService.currentUserValue;
    this.setUpRequestList();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  doRefresh(refresher) {
    this.pageNum = 1;
    this.needInfiniteScroll = true;
    this.setUpRequestList(refresher);
  }

  loadMore(infiniteScroll) {
    this.setUpRequestList(false, infiniteScroll);
  }

  private setUpRequestList(refresher?, infiniteScroll?) {
    this.userService.getReservationNotification(this.currentUser._id, this.pageSize, this.pageNum, refresher).pipe(untilDestroyed(this)).subscribe(val => {
      if (refresher) {
        refresher.complete();
        this.requests = [];
      }
      const result = this.processList(val);
      this.requests = [...this.requests, ...result];
      this.checkListFinish(val, infiniteScroll);
    });
  }

  private processList(list) {
    return list.map(val => ({
      _id: val._id,
      restaurantId: val.content.restaurantId,
      restaurantName: val.content.restaurantName,
      body: this.getBody(val.content),
      status: val.content.status,
      bgColor: this.getBgColor(val.content.status),
      time: this.getTime(val.createdTime),
    }));
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

  private getBody(content) {
    switch (content.status) {
      case 'PD': return `Waiting for response`;
      case 'AC': return `Request is confirmed`;
      case 'RJ': return `Request is denied`;
      case 'CC': return `Request is cancelled`;
      case 'CT': return `Ticket is cancelled`;
      case 'CL': return `Ticket is claimed`;
    }
  }

  private getBgColor(status) {
    switch (status) {
      case 'PD': return this.colorList.grey;
      case 'AC': return this.colorList.green;
      case 'RJ': return this.colorList.darkGrey;
      case 'CC': return this.colorList.yellow;
      case 'CT': return this.colorList.red;
      case 'CL': return this.colorList.blue;
    }
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

  goToReservationStatus(item) {
    this.navCtrl.push('ReservationStatusPage', {
      status: item.status,
      restaurantId: item.restaurantId,
      restaurantName: item.restaurantName,
      notificationId: item._id,
      view: this.navCtrl.getActive().instance,
    });
  }

  back() {
    this.navCtrl.pop();
  }

}
