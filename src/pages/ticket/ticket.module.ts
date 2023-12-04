import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { TicketPage } from './ticket';

@NgModule({
  declarations: [
    TicketPage,
  ],
  imports: [
    IonicPageModule.forChild(TicketPage),
    SuperTabsModule
  ],
})
export class TicketPageModule { }
