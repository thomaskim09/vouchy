import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { OrderDetailRemarkComponent } from './order-detail-remark';

@NgModule({
  declarations: [
    OrderDetailRemarkComponent
  ],
  imports: [
    IonicPageModule.forChild(OrderDetailRemarkComponent),
  ],
  exports: [
    OrderDetailRemarkComponent
  ]
})
export class OrderDetailRemarkComponentModule {}
