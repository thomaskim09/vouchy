import { Component, Input } from '@angular/core';

@Component({
  selector: 'reservation-status-main',
  templateUrl: 'reservation-status-main.html'
})
export class ReservationStatusMainComponent {

  @Input('main') main: any;

  confirmStatus: any;
  statusContent: any;

  constructor() { }

  ngOnChanges() {
    if (this.main) {
      this.setUpTextDisplay();
    }
  }

  private setUpTextDisplay() {
    switch (this.main.status) {
      case 'AC': {
        this.confirmStatus = 'Request is accepted :)';
        this.statusContent = this.main.msg ? this.main.msg.body : `You can find your ticket in your tickets list,
        expired reservation will be in history tickets list`;
        break;
      }
      case 'RJ': {
        this.confirmStatus = 'Request is denied';
        this.statusContent = this.main.msg ? this.main.msg.body : this.main.adminReason;
        break;
      }
      case 'CC': {
        this.confirmStatus = 'Request is cancelled';
        this.statusContent = `Maybe they are too busy at that time, you could contact them by clicking the phone icon
        in their restaurant page during business hour :)`;
        break;
      }
      case 'CT': {
        this.confirmStatus = 'Ticket is cancelled';
        this.statusContent = this.main.userReason;
        break;
      }
      case 'CL': {
        this.confirmStatus = 'Ticket is claimed';
        this.statusContent = `We hope you enjoyed your time in the restaurant, treat us a cup of coffee anytime if wanted :)`;
        break;
      }
      default: {
        this.confirmStatus = 'Waiting for response...';
        this.statusContent = `You could exit this page while waiting, you can always check your request status in your user page any time :)`;
        break;
      }
    }
  }

}
