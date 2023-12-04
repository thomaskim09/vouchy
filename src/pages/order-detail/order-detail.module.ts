import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { OrderDetailComponentsModule } from '../../components/order-detail/order-detail.components.module';
import { OrderDetailPage } from './order-detail';
import { OrderSearchShareComponentsModule } from '../../components/order-search-share/order-search-share.components.module';

@NgModule({
  declarations: [
    OrderDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderDetailPage),
    OrderDetailComponentsModule,
    OrderSearchShareComponentsModule
  ],
})
export class OrderDetailPageModule { }
