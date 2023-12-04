import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { TicketDetailCardComponentsModule } from '../../components/ticket-detail/ticket-detail-card.components.module';
import { TicketDetailPage } from './ticket-detail';

@NgModule({
  declarations: [
    TicketDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(TicketDetailPage),
    TicketDetailCardComponentsModule
  ],
})
export class TicketDetailPageModule { }
