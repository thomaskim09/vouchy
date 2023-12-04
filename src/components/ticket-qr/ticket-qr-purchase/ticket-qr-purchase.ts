import { Component, Input } from '@angular/core';

@Component({
  selector: 'ticket-qr-purchase',
  templateUrl: 'ticket-qr-purchase.html'
})
export class TicketQrPurchaseComponent {

  @Input('ticketPurchase') input: any;

  totalPrice: any;

  constructor() { }

  ngOnChanges() {
    if (this.input) {
      const total = this.input.quantity * this.input.pricePerUnit;
      this.input.paymentOffer = this.roundUpPrice(this.input.paymentOffer);
      this.totalPrice = this.roundUpPrice(this.input.paymentOffer ? total - this.input.paymentOffer : total);
    }
  }

  private roundUpPrice(value) {
    return Math.round((value + 0.00001) * 100) / 100;
  }
}
