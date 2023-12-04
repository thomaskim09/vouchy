import { Component, Input } from '@angular/core';

@Component({
  selector: 'ticket-qr-main',
  templateUrl: 'ticket-qr-main.html'
})
export class TicketQrMainComponent {

  @Input('ticketMain') input: any;

  type: string;
  quantityLeft: number;
  moveUp: boolean = false;
  encodeText: any;

  constructor() { }

  ngOnChanges() {
    if (this.input) {
      this.type = this.input.type;
      this.getEncodeText();
      this.getQuantityLeft();
    }
  }

  getEncodeText() {
    if (!this.input.isExpired) {
      this.encodeText = String(this.input.ticketCode);
    }
  }

  getTicketCode(code) {
    const text = String(code);
    return text.slice(0, 1) + ' ' + text.slice(1, 5) + ' ' + text.slice(5, 9);
  }

  private getQuantityLeft() {
    const ip = this.input;
    if (ip.isExpired) {
      this.quantityLeft = (ip.quantityUnit) ? (ip.quantity * ip.quantityUnit) - ip.claimed : ip.quantity - ip.claimed;
      return;
    }
    if (ip.voucherType === 'MV') {
      this.moveUp = ip.claimed > 0 ? true : false;
    } else {
      this.quantityLeft = (ip.quantityUnit) ? (ip.quantity * ip.quantityUnit) - ip.claimed : ip.quantity - ip.claimed;
      if (this.quantityLeft !== 1 && this.type === 'voucher') {
        this.moveUp = true;
      } else {
        this.moveUp = false;
        this.quantityLeft = 1;
      }
    }
  }

}
