import { HistoryOrderComponentsModule } from '../../components/history-order/history-order.components.module';
import { HistoryOrderDetailPage } from './history-order-detail';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    HistoryOrderDetailPage,
  ],
  imports: [
    HistoryOrderComponentsModule,
    IonicPageModule.forChild(HistoryOrderDetailPage),
  ],
})
export class HistoryOrderDetailPageModule { }
