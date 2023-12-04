import { IonicPageModule } from 'ionic-angular';
import { MenuPopOverComponent } from './menu-pop-over';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    MenuPopOverComponent
  ],
  imports: [
    IonicPageModule.forChild(MenuPopOverComponent),
  ],
  exports: [
    MenuPopOverComponent
  ]
})
export class MenuPopOverComponentModule {}
