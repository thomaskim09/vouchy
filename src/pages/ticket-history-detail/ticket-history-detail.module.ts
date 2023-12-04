import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { TicketDetailCardComponentsModule } from '../../components/ticket-detail/ticket-detail-card.components.module';
import { TicketHistoryDetailPage } from './ticket-history-detail';

@NgModule({
  declarations: [
    TicketHistoryDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(TicketHistoryDetailPage),
    TicketDetailCardComponentsModule
  ],
})
export class TicketHistoryDetailPageModule { }
