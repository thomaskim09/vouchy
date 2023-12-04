import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { SearchPage } from './search';

@NgModule({
  declarations: [
    SearchPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchPage),
  ],
  exports: [
    SearchPage,
  ]
})
export class SearchPageModule { }
