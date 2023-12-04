import { FeedbackPage } from './feedback';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    FeedbackPage,
  ],
  imports: [
    IonicPageModule.forChild(FeedbackPage),
  ],
})
export class FeedbackPageModule {}
