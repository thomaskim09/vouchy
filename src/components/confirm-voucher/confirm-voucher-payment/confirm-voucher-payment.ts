import { Component, Input } from '@angular/core';
import { DataService } from '../../../providers/data-service/data.service';

@Component({
  selector: 'confirm-voucher-payment',
  templateUrl: 'confirm-voucher-payment.html',
})
export class ConfirmVoucherPaymentComponent {

  @Input('confirmVoucherPayment') input: any;

  paymentMethod: string = 'BOOST';

  constructor(public dataService: DataService) { }

  ngOnInit() {
    this.changePaymentMethod();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    this.clearConfirmContent();
  }

  changePaymentMethod() {
    this.dataService.changeConfirmContent({
      paymentMethod: this.paymentMethod,
    });
  }

  private clearConfirmContent() {
    this.dataService.changeConfirmContent({});
  }

}
