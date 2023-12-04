import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { VoucherDetailContentComponent } from './voucher-detail-content/voucher-detail-content';
import { VoucherDetailQuantityComponent } from './voucher-detail-quantity/voucher-detail-quantity';
import { VoucherDetailRestaurantComponent } from './voucher-detail-restaurant/voucher-detail-restaurant';
import { VoucherDetailRuleComponent } from './voucher-detail-rule/voucher-detail-rule';
import { VoucherDetailMonthlyComponent } from './voucher-detail-monthly/voucher-detail-monthly';
import { VoucherDetailCashComponent } from './voucher-detail-cash/voucher-detail-cash';

@NgModule({
  declarations: [
    VoucherDetailContentComponent,
    VoucherDetailQuantityComponent,
    VoucherDetailRestaurantComponent,
    VoucherDetailRuleComponent,
    VoucherDetailMonthlyComponent,
    VoucherDetailCashComponent
  ],
  imports: [
    IonicModule
  ],
  exports: [
    VoucherDetailContentComponent,
    VoucherDetailQuantityComponent,
    VoucherDetailRestaurantComponent,
    VoucherDetailRuleComponent,
    VoucherDetailMonthlyComponent,
    VoucherDetailCashComponent
  ]
})
export class VoucherTicketShareComponentsModule { }
