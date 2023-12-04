import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { TicketQrPurchaseComponent } from './ticket-qr-purchase/ticket-qr-purchase';

@NgModule({
  declarations: [
    TicketQrPurchaseComponent,
  ],
  imports: [
    IonicModule
  ],
  exports: [
    TicketQrPurchaseComponent,
  ]
})
export class TicketQrComponentsModule { }
