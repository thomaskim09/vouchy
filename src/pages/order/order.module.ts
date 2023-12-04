import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { OrderPage } from './order';
import { SuperTabsModule } from 'ionic2-super-tabs';

@NgModule({
  declarations: [
    OrderPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderPage),
    SuperTabsModule
  ],
})
export class OrderPageModule { }
