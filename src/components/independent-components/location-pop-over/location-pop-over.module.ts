import { IonicPageModule } from 'ionic-angular';
import { LocationPopOverComponent } from './location-pop-over';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    LocationPopOverComponent
  ],
  imports: [
    IonicPageModule.forChild(LocationPopOverComponent),
  ],
  exports: [
    LocationPopOverComponent
  ]
})
export class LocationPopOverComponentModule { }
