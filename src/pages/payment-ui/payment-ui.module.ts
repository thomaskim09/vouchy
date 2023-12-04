import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentUiPage } from './payment-ui';

@NgModule({
  declarations: [
    PaymentUiPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentUiPage),
  ],
})
export class PaymentUiPageModule {}
