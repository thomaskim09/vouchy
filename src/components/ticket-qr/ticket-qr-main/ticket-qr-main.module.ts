import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { QRCodeModule } from 'angularx-qrcode';
import { TicketQrMainComponent } from './ticket-qr-main';

@NgModule({
  declarations: [
    TicketQrMainComponent,
  ],
  imports: [
    IonicPageModule.forChild(TicketQrMainComponent),
    QRCodeModule
  ],
  exports: [
    TicketQrMainComponent
  ]
})
export class TicketQrMainComponentModule {}
