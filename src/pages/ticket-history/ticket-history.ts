import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-ticket-history',
  templateUrl: 'ticket-history.html',
})
export class TicketHistoryPage {

  userId: any;
  page: any = 'TicketHistoryDetailPage';
  pageInfo: any = [
    {
      categoryId: '1',
      categoryName: 'Vouchers',
    },
    {
      categoryId: '2',
      categoryName: 'Reservations',
    }
  ];
  selectedTab: any = 0;

  constructor(public navCtrl: NavController) {
  }

  back() {
    this.navCtrl.pop();
  }

}
