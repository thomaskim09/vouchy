import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { VoucherDetailButtonComponent } from './voucher-detail-button/voucher-detail-button';
import { VoucherDetailGroupComponent } from './voucher-detail-group/voucher-detail-group';
import { VoucherDetailInfoComponent } from './voucher-detail-info/voucher-detail-info';
import { VoucherDetailLimitedComponent } from './voucher-detail-limited/voucher-detail-limited';
import { VoucherDetailMainComponent } from './voucher-detail-main/voucher-detail-main';

@NgModule({
  declarations: [
    VoucherDetailButtonComponent,
    VoucherDetailGroupComponent,
    VoucherDetailInfoComponent,
    VoucherDetailLimitedComponent,
    VoucherDetailMainComponent,
  ],
  imports: [IonicModule],
  exports: [
    VoucherDetailButtonComponent,
    VoucherDetailGroupComponent,
    VoucherDetailInfoComponent,
    VoucherDetailLimitedComponent,
    VoucherDetailMainComponent,
  ]
})
export class VoucherDetailComponentsModule { }
