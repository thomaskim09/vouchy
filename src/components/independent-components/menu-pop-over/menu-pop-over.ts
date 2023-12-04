import { AuthenticationService } from '../../../providers/authentication/authentication.service';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { CommonService } from '../../../providers/common/common.service';
import { Component } from '@angular/core';
import { DataService } from '../../../providers/data-service/data.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Platform } from 'ionic-angular/platform/platform';
import { ViewController, IonicPage, NavController, NavParams, Events } from 'ionic-angular';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'menu-pop-over',
  templateUrl: 'menu-pop-over.html',
  providers: [InAppBrowser]
})
export class MenuPopOverComponent {

  // Controller
  hasNotifications: boolean = false;
  needSignOut: boolean = false;
  activePage: any;
  currentUser: any;
  isLoggedIn: boolean;

  options: BarcodeScannerOptions;

  constructor(
    public authenticationService: AuthenticationService,
    public barcodeScanner: BarcodeScanner,
    public commonService: CommonService,
    public dataService: DataService,
    public events: Events,
    public iab: InAppBrowser,
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public viewCtrl: ViewController) { }

  ngOnInit() {
    this.activePage = this.navParams.get('activePage');
    this.hasNotifications = this.navParams.get('hasNotifications');
    this.needSignOut = this.navParams.get('needSignOut');
    this.currentUser = this.authenticationService.currentUserValue;
    this.isLoggedIn = this.authenticationService.checkLoginStatus();
  }

  scanQR() {
    if (!this.platform.is('cordova')) {
      return;
    }
    this.options = {
      prompt: 'Please scan the Vouchy QR code',
      disableSuccessBeep: true,
      showTorchButton: true,
    };
    this.barcodeScanner.scan(this.options).then(data => {
      if (!data.text) {
        return;
      }
      const urlParams = new URLSearchParams(data.text);
      const restaurantId = urlParams.get('restaurantId');
      const type = data.text.slice(8, 11);
      const pageName = type === 'pwa' ? 'OrderPage' : 'VoucherPage';
      const message = type === 'pwa' ? 'Please scan a valid dine in QR code :)' : 'Please scan a valid vouchy QR code :)';
      if (restaurantId) {
        this.navCtrl.push(pageName, {
          restaurantId: restaurantId,
        });
      } else {
        this.commonService.presentToast(message);
      }
    });
  }

  goToNotification() {
    if (this.isLoggedIn) {
      const object = {
        type: 'notification',
        userId: this.currentUser._id,
        hasNotifications: this.hasNotifications
      };
      this.hasNotifications = false;
      this.pageNavigate('DisplayPage', object);
    } else {
      this.goToLogin();
    }
  }

  goToFavourite() {
    if (this.isLoggedIn) {
      const object = {
        type: 'favourite',
        userId: this.currentUser._id
      };
      this.pageNavigate('DisplayPage', object);
    } else {
      this.goToLogin();
    }
  }

  goToReport() {
    this.iab.create('http://m.me/VouchyApp', '_system');
  }

  signOut() {
    this.authenticationService.logout();
    this.events.publish('logout');
    this.dataService.changeRefreshContent({
      ticketPage: true,
      ticketDetailPage: true,
      userId: undefined
    });
    this.goToLogin();
    this.commonService.presentToast('Log out successfully');
  }

  login() {
    this.goToLogin();
  }

  close(data?) {
    this.viewCtrl.dismiss(data);
  }

  private goToLogin() {
    this.navCtrl.push('LoginPage', { view: this.activePage });
    this.close();
  }

  private pageNavigate(page, object) {
    this.navCtrl.push(page, object);
    this.close({ hasNotifications: this.hasNotifications });
  }
}
