import { Component, Input } from '@angular/core';

@Component({
  selector: 'voucher-detail-main',
  templateUrl: 'voucher-detail-main.html'
})
export class VoucherDetailMainComponent {

  @Input('voucherMain') voucherMain: any;

  constructor() {

  }

}
