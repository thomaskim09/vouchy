import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeDetailPage } from './home-detail';
import { HomeDetailComponentsModule } from '../../components/home-detail/home-detail.components.module';

@NgModule({
  declarations: [
    HomeDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeDetailPage),
    HomeDetailComponentsModule
  ],
})
export class HomeDetailPageModule { }
