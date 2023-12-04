import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { CallPickerPage } from './call-picker';

@NgModule({
  declarations: [
    CallPickerPage
  ],
  imports: [
    IonicPageModule.forChild(CallPickerPage),
  ],
})
export class CallPickerPageModule { }
