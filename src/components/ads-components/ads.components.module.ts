import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { AdsSlideComponent } from './ads-slide/ads-slide';

@NgModule({
  declarations: [
    AdsSlideComponent,
  ],
  imports: [
    IonicModule
  ],
  exports: [
    AdsSlideComponent,
  ]
})
export class AdsComponentsModule { }
