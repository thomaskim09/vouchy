import { Firebase } from '@ionic-native/firebase';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

@Injectable()
export class FcmService {

  constructor(
    public platform: Platform,
    public firebaseNative: Firebase) { }

  // Get permission from the user
  async getToken() {
    let token;
    if (this.platform.is('android')) {
      token = await this.firebaseNative.getToken();
    }
    if (this.platform.is('ios')) {
      token = await this.firebaseNative.getToken();
      await this.firebaseNative.grantPermission();
    }
    return token;
  }

  // Listen to incoming FCM messages
  listenToNotifications() {
    return this.firebaseNative.onNotificationOpen();
  }
}
