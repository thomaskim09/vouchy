import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { IntroPage } from './intro';

@NgModule({
  declarations: [
    IntroPage
  ],
  imports: [
    IonicPageModule.forChild(IntroPage),
  ],
})
export class IntroPageModule { }
