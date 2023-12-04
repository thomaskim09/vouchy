import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { OrderPickerPage } from './order-picker';

@NgModule({
  declarations: [
    OrderPickerPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderPickerPage),
  ],
})
export class OrderPickerPageModule { }
