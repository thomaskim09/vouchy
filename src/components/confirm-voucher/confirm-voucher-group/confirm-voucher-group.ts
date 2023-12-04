import { Component, Input } from '@angular/core';

@Component({
  selector: 'confirm-voucher-group',
  templateUrl: 'confirm-voucher-group.html'
})
export class ConfirmVoucherGroupComponent {

  @Input('confirmVoucherGroup') input: any;

  constructor() { }

}
