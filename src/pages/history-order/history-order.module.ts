import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HistoryOrderPage } from './history-order';

@NgModule({
  declarations: [
    HistoryOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(HistoryOrderPage),
  ],
})
export class HistoryOrderPageModule {}
