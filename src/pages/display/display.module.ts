import { DisplayPage } from './display';
import { DisplayShareComponentsModule } from '../../components/display-share/display-share.components.module';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    DisplayPage,
  ],
  imports: [
    DisplayShareComponentsModule,
    IonicPageModule.forChild(DisplayPage),
  ],
})
export class DisplayPageModule { }
