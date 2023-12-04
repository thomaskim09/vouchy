import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class CommonService {

  constructor(public toastCtrl: ToastController) { }

  presentToast(title, duration = 2500) {
    this.toastCtrl.create({
      message: title,
      duration: duration,
      position: 'top'
    }).present();
  }
}
