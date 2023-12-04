import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { RefundPage } from './refund';

@NgModule({
  declarations: [
    RefundPage,
  ],
  imports: [
    IonicPageModule.forChild(RefundPage),
  ],
})
export class RefundPageModule { }
