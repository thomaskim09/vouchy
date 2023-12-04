import { ConfirmVoucherComponentsModule } from '../../components/confirm-voucher/confirm-voucher.components.module';
import { ConfirmVoucherPage } from './confirm-voucher';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    ConfirmVoucherPage,
  ],
  imports: [
    ConfirmVoucherComponentsModule,
    IonicPageModule.forChild(ConfirmVoucherPage),
  ],
})
export class ConfirmVoucherPageModule { }
