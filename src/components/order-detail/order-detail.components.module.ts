import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { OrderButtonComponent } from './order-button/order-button';
import { OrderCallComponent } from './order-call/order-call';
import { OrderDetailSlideComponent } from './order-detail-slide/order-detail-slide';

@NgModule({
  declarations: [
    OrderDetailSlideComponent,
    OrderCallComponent,
    OrderButtonComponent
  ],
  imports: [
    IonicModule
  ],
  exports: [
    OrderDetailSlideComponent,
    OrderCallComponent,
    OrderButtonComponent
  ]
})
export class OrderDetailComponentsModule { }
