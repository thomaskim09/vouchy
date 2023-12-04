import { AuthenticationService } from '../../providers/authentication/authentication.service';
import { CommonService } from '../../providers/common/common.service';
import { Component, ViewChild } from '@angular/core';
import { DataService } from '../../providers/data-service/data.service';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { UserService } from '../../providers/user/user.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { VoucherCommonService } from '../../providers/common/voucher-common.service';
import lo_isEmpty from 'lodash/isEmpty';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-ticket-detail',
  templateUrl: 'ticket-detail.html',
})
export class TicketDetailPage {

  userId: string;
  categoryId: string;

  // List properties
  categoryDetails: any;
  statusCounter: number = 0;
  rawTickets: any = [];

  // Infinite scroll
  pageNum: number = 1;
  pageSize: number = 10;

  // Tools controller
  refresher: any;
  infiniteScroll: any;
  needRefresher: boolean = true;
  needInfiniteScroll: boolean = true;
  timer: any;
  firstEnter: boolean = true;

  // Custom scroll for first category
  @ViewChild(Content) content: Content;

  constructor(
    public authenticationService: AuthenticationService,
    public commonService: CommonService,
    public dataService: DataService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserService,
    public vcs: VoucherCommonService) {
  }

  ngOnInit() {
    this.categoryId = this.navParams.get('categoryId');
    this.needInfiniteScroll = this.categoryId !== '0';
    this.listenToLoginRefresh();
  }

  ionViewDidEnter() {
    if (this.firstEnter) {
      this.firstEnter = false;
      this.setUpTicketPage();
    }
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    clearTimeout(this.timer);
  }

  private setUpTicketPage() {
    this.timer = setTimeout(() => {
      if (this.authenticationService.checkLoginStatus()) {
        const currentUser = this.authenticationService.currentUserValue;
        this.userId = currentUser._id;
        this.setUpTicketList();
      } else {
        this.needRefresher = false;
        this.needInfiniteScroll = false;
      }
    }, 500);
  }

  private setUpTicketList(refresh = false) {
    this.pageNum = 1;
    switch (this.categoryId) {
      case '1': this.loadTicketList(this.userId, 'PU', this.pageSize, this.pageNum, refresh); break;
      case '2': this.loadTicketList(this.userId, 'RE', this.pageSize, this.pageNum, refresh); break;
      case '3': this.loadTicketList(this.userId, 'PC', this.pageSize, this.pageNum, refresh); break;
    }
  }

  private listenToLoginRefresh() {
    this.dataService.currentRefreshContent.pipe(untilDestroyed(this)).subscribe(val => {
      if (lo_isEmpty(val)) {
        return;
      }
      if (val.ticketDetailPage && val.userId) {
        this.userId = val.userId;
        this.needRefresher = true;
        this.setUpTicketList(true);
      } else if (val.ticketDetailPage && !val.userId) {
        this.userId = undefined;
        this.needRefresher = false;
      }
    });
  }

  doRefresh(refresher) {
    this.refresher = refresher;
    this.pageNum = 1;
    this.statusCounter = 0;
    this.refreshTicketCount();
    this.setUpTicketList(this.refresher);
  }

  loadMore(infiniteScroll) {
    this.infiniteScroll = infiniteScroll;
    this.loadInfiniteTicket();
  }

  private refreshTicketCount() {
    this.dataService.changeRefreshContent({
      ticketPage: true,
      userId: this.userId,
    });
  }

  private loadInfiniteTicket() {
    if (this.needInfiniteScroll) {
      switch (this.categoryId) {
        case '1': this.loadTicketList(this.userId, 'PU', this.pageSize, this.pageNum, false, true); break;
        case '2': this.loadTicketList(this.userId, 'RE', this.pageSize, this.pageNum, false, true); break;
        case '3': this.loadTicketList(this.userId, 'PC', this.pageSize, this.pageNum, false, true); break;
      }
    }
  }

  private loadTicketList(userId, status, pageSize, pageNum, refresh?, infinite?) {
    this.userService.getTicketsList(userId, status, pageSize, pageNum, refresh).pipe(untilDestroyed(this)).subscribe(val => {
      if (refresh) {
        this.rawTickets = [];
        if (this.refresher) { this.refresher.complete(); }
      } else if (infinite) {
        if (this.infiniteScroll) { this.infiniteScroll.complete(); }
      }

      // Combining list
      val = this.vcs.processTicket(val);
      this.rawTickets = [...this.rawTickets, ...val];
      this.categoryDetails = this.rawTickets;

      // Trigger DOM update
      if (this.categoryId === '0' && infinite) {
        this.commonService.presentToast('');
      }

      // Check if list finished
      if (val.length < this.pageSize) {
        this.pageNum = 1;
        this.needInfiniteScroll = false;
      } else {
        this.pageNum++;
        this.needInfiniteScroll = true;
      }
    }, error => {
      this.commonService.presentToast('Server is not responding');
      if (this.refresher) { this.refresher.complete(); }
    });
  }

  goToLogin() {
    if (this.authenticationService.checkLoginStatus()) {
      this.userId = this.authenticationService.currentUserValue._id;
      this.needRefresher = true;
      this.refreshTicketCount();
      this.setUpTicketList(true);
    } else {
      const view = this.navCtrl.getActive().instance;
      this.navCtrl.parent.parent.parent.parent.push('LoginPage', { view: view });
    }
  }

}
