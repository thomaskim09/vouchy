import { FilterResultComponent } from './filter-result';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    FilterResultComponent
  ],
  imports: [
    IonicPageModule.forChild(FilterResultComponent),
  ],
  exports: [
    FilterResultComponent
  ]
})
export class FilterResultComponentModule { }
