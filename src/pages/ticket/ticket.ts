import { AuthenticationService } from '../../providers/authentication/authentication.service';
import { Component } from '@angular/core';
import { DataService } from '../../providers/data-service/data.service';
import { IonicPage, NavController } from 'ionic-angular';
import { untilDestroyed } from 'ngx-take-until-destroy';
import lo_isEmpty from 'lodash/isEmpty';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-ticket',
  templateUrl: 'ticket.html',
})
export class TicketPage {

  userId: string;
  page: any = 'TicketDetailPage';
  pageInfo: any = [
    {
      categoryId: '1',
      categoryName: 'Vouchers',
    },
    {
      categoryId: '2',
      categoryName: 'Reservations',
    },
    {
      categoryId: '3',
      categoryName: 'Feedbacks',
    }
  ];
  selectedTab: number = 0;

  // Controller
  timer: any;

  constructor(
    public authenticationService: AuthenticationService,
    public dataService: DataService,
    public navCtrl: NavController) { }

  ngOnInit() {
    this.timer = setTimeout(() => {
      if (this.authenticationService.checkLoginStatus()) {
        this.userId = this.authenticationService.currentUserValue._id;
      }
    }, 500);
    this.listenToLoginRefresh();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    clearTimeout(this.timer);
  }

  private listenToLoginRefresh() {
    this.dataService.currentRefreshContent.pipe(untilDestroyed(this)).subscribe(val => {
      if (!lo_isEmpty(val)) {
        if (val.ticketPage && val.userId) {
          this.userId = val.userId;
        } else if (!val.userId) {
          this.userId = undefined;
        }
      }
    });
  }

  goToHistoryTicket() {
    if (!this.userId) {
      this.goToLogin();
      return;
    }
    this.navCtrl.parent.parent.push('TicketHistoryPage');
  }

  private goToLogin() {
    this.userId = undefined;
    this.navCtrl.parent.parent.push('LoginPage', {
      view: this.navCtrl.getActive().instance
    });
  }

}
