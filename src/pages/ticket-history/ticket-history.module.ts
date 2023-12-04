import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TicketHistoryPage } from './ticket-history';
import { SuperTabsModule } from 'ionic2-super-tabs';

@NgModule({
  declarations: [
    TicketHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(TicketHistoryPage),
    SuperTabsModule
  ],
})
export class TicketHistoryPageModule {}
