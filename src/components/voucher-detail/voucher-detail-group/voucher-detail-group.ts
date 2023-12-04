import { Component, Input } from '@angular/core';

@Component({
  selector: 'voucher-detail-group',
  templateUrl: 'voucher-detail-group.html'
})
export class VoucherDetailGroupComponent {

  @Input('voucherGroup') voucherGroup: any;

  constructor() { }

}
