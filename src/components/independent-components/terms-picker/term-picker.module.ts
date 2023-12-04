import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { TermPickerPage } from './term-picker';

@NgModule({
  declarations: [
    TermPickerPage,
  ],
  imports: [
    IonicPageModule.forChild(TermPickerPage),
  ],
})
export class TermPickerPageModule { }
