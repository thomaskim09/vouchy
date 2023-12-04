import { AuthenticationService } from '../../providers/authentication/authentication.service';
import { CommonService } from '../../providers/common/common.service';
import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { IonicPage, NavController, ModalController, Events, AlertController } from 'ionic-angular';
import { NgxImageCompressService } from 'ngx-image-compress';
import { UserService } from '../../providers/user/user.service';
import { formatDistanceStrict, parseISO } from 'date-fns';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { DataService } from './../../providers/data-service/data.service';
import { SoundService } from '../../providers/data-service/sound.service';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Platform } from 'ionic-angular/platform/platform';
import lo_isEmpty from 'lodash/isEmpty';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
  providers: [InAppBrowser]
})
export class UserPage {

  // HTML properties
  userId: string;
  profileImage: string = '../../assets/imgs/profile-image-0.png';
  defaultProfileImage = '../../assets/imgs/profile-image-0.png';
  username: string;
  defaultUsername: string = `Let's log in`;
  dayJoined: string;
  defaultDayJoined: string = 'We\'re happy to have you :)';
  email: string = 'Please insert an email';
  defaultEmail: string = 'Please insert an email';

  // Controller
  timer: any;

  soundOption: any;
  options: BarcodeScannerOptions;

  constructor(
    public authenticationService: AuthenticationService,
    public commonService: CommonService,
    public events: Events,
    public iab: InAppBrowser,
    public imageCompress: NgxImageCompressService,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public userService: UserService,
    public dataService: DataService,
    public soundService: SoundService,
    public barcodeScanner: BarcodeScanner,
    public platform: Platform) {
  }

  ngOnInit() {
    this.soundOption = this.soundService.currentSoundValue;
    this.timer = setTimeout(() => {
      this.refreshUserDetails();
    }, 500);
    this.listenToRefreshUserDetails();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    this.events.unsubscribe('logout');
    clearTimeout(this.timer);
  }

  private listenToRefreshUserDetails() {
    this.events.subscribe('logout', val => {
      this.refreshUserDetails();
    });
    this.dataService.currentRefreshContent.pipe(untilDestroyed(this)).subscribe(val => {
      if (!lo_isEmpty(val)) {
        if (val.userPage && val.userId) {
          this.refreshUserDetails();
        }
      }
    });
  }

  private refreshUserDetails() {
    if (this.authenticationService.checkLoginStatus()) {
      const currentUser = this.authenticationService.currentUserValue;
      this.userId = currentUser._id;
      this.username = currentUser.username;
      this.dayJoined = 'Joined ' + formatDistanceStrict(parseISO(currentUser.createdTime), new Date()) + ' ago';
      this.profileImage = currentUser.profileImage || this.defaultProfileImage;
      this.email = currentUser.email;
    } else {
      this.userId = undefined;
      this.username = this.defaultUsername;
      this.dayJoined = this.defaultDayJoined;
      this.profileImage = this.defaultProfileImage;
      this.email = this.defaultEmail;
    }
  }

  presentMenu() {
    this.modalCtrl.create('MenuPopOverComponent', {
      activePage: this.navCtrl.getActive().instance,
      needSignOut: true,
    }).present();

    this.refreshUserDetails();
  }

  presentEmail() {
    if (this.authenticationService.checkLoginStatus()) {
      this.alertCtrl.create({
        title: 'Update Email',
        inputs: [
          {
            name: 'email',
            placeholder: 'example@gmail.com',
            type: 'text',
          },
        ],
        buttons: [
          {
            text: 'Back',
            role: 'cancel',
          },
          {
            text: 'Update',
            handler: data => {
              if (!data.email) {
                this.commonService.presentToast('Please insert an email');
                return;
              }
              if (data.email === this.email) {
                this.commonService.presentToast('Email is same as previous');
                return;
              }
              if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(data.email)) {
                this.commonService.presentToast('Please insert a valid email');
                return;
              }
              this.userService.changeEmail(this.userId, data.email).pipe(untilDestroyed(this)).subscribe(val => {
                this.email = data.email;
                this.commonService.presentToast('Email updated');
                const currentUser = this.authenticationService.currentUserValue;
                currentUser.email = data.email;
                this.authenticationService.updateCurrentUser(currentUser);
              });
            }
          }
        ]
      }).present();
    }
  }

  toggleSound(ev) {
    this.soundOption.needSound = ev.value;
    this.soundService.updateSoundUption(this.soundOption);
    const text = ev.value ? 'Sound is turn on' : 'Sound is turn off';
    this.commonService.presentToast(text, 1500);
  }

  private goLogin() {
    this.navCtrl.parent.parent.push('LoginPage', { view: this.navCtrl.getActive().instance });
  }

  presentImagePicker() {
    if (this.authenticationService.checkLoginStatus()) {
      const modal = this.modalCtrl.create('ImagePickerPage');
      modal.onDidDismiss(data => {
        if (data) {
          this.imageCompress.compressFile(data, 1, 50, 50).then(result => {
            this.profileImage = result;
            this.userService.changeProfileImage(this.userId, result).pipe(untilDestroyed(this)).subscribe(val => {
              this.commonService.presentToast('Profile image updated');
              const currentUser = this.authenticationService.currentUserValue;
              currentUser.profileImage = result;
              this.authenticationService.updateCurrentUser(currentUser);
            });
          });
        }
      });
      modal.present();
    } else {
      this.goLogin();
    }
  }

  scanQR() {
    if (!this.platform.is('cordova')) {
      return;
    }
    this.barcode();
  }

  private barcode() {
    this.options = {
      prompt: 'Please scan the vouchy QR code',
      disableSuccessBeep: true,
      showTorchButton: true,
    };
    this.barcodeScanner.scan(this.options).then(data => {
      if (!data.text) {
        return;
      }
      this.processQR(data.text);
    });
  }

  private processQR(text) {
    const urlParams = new URLSearchParams(text);
    const restaurantId = urlParams.get('restaurantId');
    const type = text.slice(8, 11);
    const pageName = type === 'pwa' ? 'OrderPage' : 'VoucherPage';
    const message = type === 'pwa' ? 'Please scan a valid dine in QR code :)' : 'Please scan a valid vouchy QR code :)';
    if (restaurantId) {
      this.navCtrl.parent.parent.push(pageName, {
        restaurantId: restaurantId,
      });
    } else {
      this.commonService.presentToast(message);
    }
  }

  goToLogin() {
    if (!this.authenticationService.checkLoginStatus()) {
      this.goLogin();
    }
  }

  goToCoffee() {
    this.navCtrl.parent.parent.push('CoffeePage');
  }

  presentTermPicker() {
    this.modalCtrl.create('TermPickerPage').present();
  }

  goToCustomer() {
    this.modalCtrl.create('CallPickerPage', {
      type: 'support',
      contact: '0186625753'
    }).present();
  }

  goToOrderHistory() {
    if (this.authenticationService.checkLoginStatus()) {
      this.navCtrl.parent.parent.push('HistoryOrderPage', {
        type: 'months'
      });
    } else {
      this.goLogin();
    }
  }

  goToReservation() {
    this.events.publish('reservationRefresh');
    this.navCtrl.parent.parent.push('ReservationRequestPage');
  }
}
