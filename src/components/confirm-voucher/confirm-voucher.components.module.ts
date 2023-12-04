import { ConfirmVoucherButtonComponent } from './confirm-voucher-button/confirm-voucher-button';
import { ConfirmVoucherControlComponent } from './confirm-voucher-control/confirm-voucher-control';
import { ConfirmVoucherGroupComponent } from './confirm-voucher-group/confirm-voucher-group';
import { ConfirmVoucherInfoComponent } from './confirm-voucher-info/confirm-voucher-info';
import { ConfirmVoucherMainComponent } from './confirm-voucher-main/confirm-voucher-main';
import { ConfirmVoucherPaymentComponent } from './confirm-voucher-payment/confirm-voucher-payment';
import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    ConfirmVoucherButtonComponent,
    ConfirmVoucherControlComponent,
    ConfirmVoucherGroupComponent,
    ConfirmVoucherInfoComponent,
    ConfirmVoucherMainComponent,
    ConfirmVoucherPaymentComponent,
  ],
  imports: [
    IonicModule
  ],
  exports: [
    ConfirmVoucherButtonComponent,
    ConfirmVoucherControlComponent,
    ConfirmVoucherGroupComponent,
    ConfirmVoucherInfoComponent,
    ConfirmVoucherMainComponent,
    ConfirmVoucherPaymentComponent,
  ]
})
export class ConfirmVoucherComponentsModule { }
