import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { ReservationTicketShareComponentsModule } from '../../components/reservation-ticket-share/reservation-ticket-share.components.module';
import { TicketQrComponentsModule } from '../../components/ticket-qr/ticket-qr.components.module';
import { TicketQrMainComponentModule } from '../../components/ticket-qr/ticket-qr-main/ticket-qr-main.module';
import { TicketQrPage } from './ticket-qr';
import { VoucherTicketShareComponentsModule } from '../../components/voucher-ticket-share/voucher-ticket-share.components.module';

@NgModule({
  declarations: [
    TicketQrPage,
  ],
  imports: [
    IonicPageModule.forChild(TicketQrPage),
    ReservationTicketShareComponentsModule,
    TicketQrComponentsModule,
    TicketQrMainComponentModule,
    VoucherTicketShareComponentsModule,
  ],
})
export class TicketQrPageModule { }
