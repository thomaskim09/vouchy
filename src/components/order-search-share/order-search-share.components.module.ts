import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { OrderDetailCardComponent } from './order-detail-card/order-detail-card';

@NgModule({
  declarations: [
    OrderDetailCardComponent,
  ],
  imports: [
    IonicModule
  ],
  exports: [
    OrderDetailCardComponent,
  ]
})
export class OrderSearchShareComponentsModule { }
