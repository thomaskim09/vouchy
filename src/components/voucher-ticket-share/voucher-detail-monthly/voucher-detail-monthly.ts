import { Component, Input } from '@angular/core';

@Component({
  selector: 'voucher-detail-monthly',
  templateUrl: 'voucher-detail-monthly.html'
})
export class VoucherDetailMonthlyComponent {

  @Input('voucherMonthly') input: any;

  itemOpened = false;

  toggleSection() {
    this.itemOpened = !this.itemOpened;
  }
}
