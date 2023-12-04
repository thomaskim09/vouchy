import { ConfirmOrderComponentsModule } from '../../components/confirm-order/confirm-order.components.module';
import { ConfirmOrderPage } from './confirm-order';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    ConfirmOrderPage,
  ],
  imports: [
    ConfirmOrderComponentsModule,
    IonicPageModule.forChild(ConfirmOrderPage),
  ],
})
export class ConfirmOrderPageModule { }
