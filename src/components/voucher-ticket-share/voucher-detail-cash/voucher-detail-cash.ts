import { Component, Input } from '@angular/core';

@Component({
  selector: 'voucher-detail-cash',
  templateUrl: 'voucher-detail-cash.html'
})
export class VoucherDetailCashComponent {

  @Input('voucherCash') input: any;
}
