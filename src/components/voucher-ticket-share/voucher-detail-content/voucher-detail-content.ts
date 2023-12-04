import { Component, Input } from '@angular/core';

@Component({
  selector: 'voucher-detail-content',
  templateUrl: 'voucher-detail-content.html'
})
export class VoucherDetailContentComponent {

  @Input('voucherContent') input: any;

  itemOpened = false;

  constructor() { }

  toggleSection() {
    this.itemOpened = !this.itemOpened;
  }
}
