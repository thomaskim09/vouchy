import { Component, Input } from '@angular/core';

@Component({
  selector: 'voucher-detail-quantity',
  templateUrl: 'voucher-detail-quantity.html'
})
export class VoucherDetailQuantityComponent {

  @Input('voucherQuantity') input: any;

  itemOpened = false;

  constructor() { }

  toggleSection() {
    this.itemOpened = !this.itemOpened;
  }
}
