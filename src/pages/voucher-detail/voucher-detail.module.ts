import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VoucherDetailPage } from './voucher-detail';
import { VoucherDetailComponentsModule } from '../../components/voucher-detail/voucher-detail.components.module';
import { VoucherTicketShareComponentsModule } from '../../components/voucher-ticket-share/voucher-ticket-share.components.module';
import { DisplayShareComponentsModule } from '../../components/display-share/display-share.components.module';

@NgModule({
  declarations: [
    VoucherDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(VoucherDetailPage),
    VoucherDetailComponentsModule,
    VoucherTicketShareComponentsModule,
    DisplayShareComponentsModule
  ]
})
export class VoucherDetailPageModule { }
