import { HistoryOrderButtonComponent } from './history-order-button/history-order-button';
import { HistoryOrderMainComponent } from './history-order-main/history-order-main';
import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    HistoryOrderButtonComponent,
    HistoryOrderMainComponent,
  ],
  imports: [
    IonicModule
  ],
  exports: [
    HistoryOrderButtonComponent,
    HistoryOrderMainComponent,
  ]
})
export class HistoryOrderComponentsModule { }
