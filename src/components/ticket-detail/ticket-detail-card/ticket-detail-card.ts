import { Component, Input } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { TicketDetailPage } from '../../../pages/ticket-detail/ticket-detail';

@Component({
  selector: 'ticket-detail-card',
  templateUrl: 'ticket-detail-card.html'
})
export class TicketDetailCardComponent {

  @Input('categoryDetails') categoryDetails: any;

  // skeleton
  skeletonArray: any[] = new Array(1);

  // Controller
  needSpinner: boolean = false;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController) { }

  navigateToTicket(ticket) {
    event.stopPropagation();
    this.needSpinner = true;
    const object = {
      ticketId: ticket._id,
      restaurantName: ticket.restaurantName,
      restaurantId: ticket.restaurantId,
      status: ticket.status,
      isExpired: ticket.isExpired
    };
    if (ticket.status === 'RE') {
      object['notificationId'] = ticket.notificationId;
    }
    const lastPage = this.navCtrl.getActive().instance;
    if (lastPage instanceof TicketDetailPage) {
      if (ticket.status === 'PC') {
        object['voucherId'] = ticket.voucherId;
        object['voucherName'] = ticket.voucherName;
        this.navCtrl.parent.parent.parent.parent.push('FeedbackPage', object);
      } else {
        this.navCtrl.parent.parent.parent.parent.push('TicketQrPage', object);
      }
    } else {
      this.navCtrl.parent.parent.push('TicketQrPage', object);
    }
    this.needSpinner = false;
  }
}
