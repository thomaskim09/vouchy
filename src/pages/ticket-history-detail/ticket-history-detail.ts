import { AuthenticationService } from '../../providers/authentication/authentication.service';
import { CommonService } from '../../providers/common/common.service';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavParams, Content } from 'ionic-angular';
import { UserService } from '../../providers/user/user.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { VoucherCommonService } from './../../providers/common/voucher-common.service';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-ticket-history-detail',
  templateUrl: 'ticket-history-detail.html',
})
export class TicketHistoryDetailPage {

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
  needInfiniteScroll: boolean = true;

  // Custom scroll for first category
  @ViewChild(Content)
  content: Content;

  constructor(
    public authenticationService: AuthenticationService,
    public commonService: CommonService,
    public navParams: NavParams,
    public userService: UserService,
    public vcs: VoucherCommonService) {
  }

  ngOnInit() {
    this.categoryId = this.navParams.get('categoryId');
    this.userId = this.authenticationService.currentUserValue._id;
    this.setUpHistoryTicketList();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private setUpHistoryTicketList(refresh = false) {
    this.pageNum = 1;
    switch (this.categoryId) {
      case '1': this.loadTicketList(this.userId, 'HV', this.pageSize, this.pageNum, refresh); break;
      case '2': this.loadTicketList(this.userId, 'HR', this.pageSize, this.pageNum, refresh); break;
    }
  }

  doRefresh(refresher) {
    this.refresher = refresher;
    this.pageNum = 1;
    this.statusCounter = 0;
    this.setUpHistoryTicketList(true);
  }

  loadMore(infiniteScroll) {
    this.infiniteScroll = infiniteScroll;
    this.loadInfiniteTicket();
  }

  private loadInfiniteTicket() {
    if (this.needInfiniteScroll) {
      switch (this.categoryId) {
        case '1': this.loadTicketList(this.userId, 'HV', this.pageSize, this.pageNum, false, true); break;
        case '2': this.loadTicketList(this.userId, 'HR', this.pageSize, this.pageNum, false, true); break;
      }
    }
  }

  private loadTicketList(userId, type, pageSize, pageNum, refresh?, infinite?) {
    this.userService.getTicketsList(userId, type, pageSize, pageNum, refresh).pipe(untilDestroyed(this)).subscribe(val => {
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

      // Trigger result
      if (this.categoryId === '0') {
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

}
