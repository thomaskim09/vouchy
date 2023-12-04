import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { TicketDetailCardComponent } from './ticket-detail-card/ticket-detail-card';

@NgModule({
  declarations: [
    TicketDetailCardComponent,
  ],
  imports: [
    IonicModule
  ],
  exports: [
    TicketDetailCardComponent,
  ]
})
export class TicketDetailCardComponentsModule { }
