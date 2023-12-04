import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { VoucherPage } from './voucher';

@NgModule({
  declarations: [
    VoucherPage,
  ],
  imports: [
    IonicPageModule.forChild(VoucherPage),
    SuperTabsModule
  ],
  exports: [
    VoucherPage,
  ]
})
export class VoucherPageModule { }
