import { ConfirmOrderButtonComponent } from './confirm-order-button/confirm-order-button';
import { ConfirmOrderCardComponent } from './confirm-order-card/confirm-order-card';
import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    ConfirmOrderButtonComponent,
    ConfirmOrderCardComponent,
  ],
  imports: [
    IonicModule
  ],
  exports: [
    ConfirmOrderButtonComponent,
    ConfirmOrderCardComponent,
  ]
})
export class ConfirmOrderComponentsModule { }
