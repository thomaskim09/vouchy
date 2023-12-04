import { AppMinimize } from '@ionic-native/app-minimize';
import { AuthenticationService } from '../providers/authentication/authentication.service';
import { CacheService } from 'ionic-cache';
import { Component, ViewChild } from '@angular/core';
import { FcmService } from '../providers/fcm/fcm.service';
import { HomeDetailPage } from '../pages/home-detail/home-detail';
import { Network } from '@ionic-native/network';
import { Platform, AlertController, Events, App, Nav, IonicApp } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TicketDetailPage } from '../pages/ticket-detail/ticket-detail';
import { TokenService } from '../providers/authentication/token.service';
import { UserPage } from '../pages/user/user';
import { tap } from 'rxjs/operators/tap';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { DataService } from './../providers/data-service/data.service';
import { Vibration } from '@ionic-native/vibration';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';
import { Insomnia } from '@ionic-native/insomnia';
import { SoundService } from '../providers/data-service/sound.service';
import { TranslateService } from '../providers/data-service/translate.service';
import { IntroService } from './../providers/data-service/intro.service';

@Component({
  templateUrl: 'app.html',
  providers: [Network, ScreenOrientation, AppMinimize, Insomnia, MobileAccessibility]
})
export class MyApp {

  rootPage: string = 'HomePage';

  networkAlert: any;

  // To control double tap exit
  @ViewChild(Nav) nav: Nav;
  backSub: any;

  // Controller
  timer: any;

  constructor(
    public alertCtrl: AlertController,
    public app: App,
    public appMinimize: AppMinimize,
    public authenticationService: AuthenticationService,
    public cacheService: CacheService,
    public events: Events,
    public fcm: FcmService,
    public ionicApp: IonicApp,
    public network: Network,
    public platform: Platform,
    public screenOrientation: ScreenOrientation,
    public splashScreen: SplashScreen,
    public statusBar: StatusBar,
    public tokenService: TokenService,
    public dataService: DataService,
    public vibration: Vibration,
    public insomnia: Insomnia,
    public mobileAccessibility: MobileAccessibility,
    public soundService: SoundService,
    public translateService: TranslateService,
    public introService: IntroService) {
    this.initializeApp();
  }

  initializeApp() {
    this.authenticationService.setUpUser();
    this.tokenService.setUpToken();
    this.soundService.setUpSound();
    this.translateService.setUpTranslate();
    this.introService.setUpIntro();
    this.platform.ready().then(() => {
      this.setUpCacheService();
      if (this.platform.is('cordova')) {
        if (this.platform.is('ios')) {
          this.statusBar.hide();
        } else {
          this.statusBar.styleDefault();
          this.statusBar.backgroundColorByHexString('#ffffff');
        }
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
        this.mobileAccessibility.usePreferredTextZoom(false);
        this.listenNotification();
        this.listenNetworkConnection();
        this.insomnia.keepAwake().then();
        this.splashScreen.hide();
        this.soundService.loadSound();
        this.setUpBackButton();
      }
    });
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    if (this.backSub) {
      this.backSub();
    }
    clearTimeout(this.timer);
    if (this.platform.is('cordova')) {
      this.insomnia.allowSleepAgain().then();
    }
  }

  private setUpCacheService() {
    this.cacheService.setDefaultTTL(60 * 60 * 24);
    this.cacheService.setOfflineInvalidate(false);
  }

  private listenNotification() {
    this.timer = setTimeout(() => {
      this.fcm.listenToNotifications().pipe(tap(msg => {
        if (msg.content) {
          msg.content = JSON.parse(msg.content);
        }
        switch (msg.type) {
          case 'O': this.dataService.changeFcmMessage({ msg: msg }); break;
          case 'R': this.handleReservation(msg); break;
          case 'N': this.orderDoneAlert(msg); break;
          case 'F': this.dataService.changeCommonNoti({ hasNotification: true }); break;
        }
      })).pipe(untilDestroyed(this)).subscribe();
    }, 1000);
  }

  private listenNetworkConnection() {
    this.network.onConnect().pipe(untilDestroyed(this)).subscribe(() => {
      this.networkAlert.dismiss();
    });
    this.network.onDisconnect().pipe(untilDestroyed(this)).subscribe(() => {
      const nav = this.app._appRoot._getActivePortal() || this.app.getActiveNavs()[0];
      const activeView = nav.getActive();
      if (activeView.isOverlay) {
        return;
      }
      this.networkAlert = this.alertCtrl.create({
        title: 'No internet... (O.O)',
        subTitle: `Are you connected to the internet?`,
        buttons: [
          {
            text: 'Yes',
          }
        ]
      });
      this.networkAlert.present();
    });
  }

  private setUpBackButton() {
    if (this.platform.is('android') || this.platform.is('windows')) {
      this.backSub = this.platform.registerBackButtonAction(() => {
        const activeModal = this.ionicApp._modalPortal.getActive();
        if (activeModal) {
          activeModal.dismiss();
          return;
        } else if (this.nav.canGoBack()) {
          this.nav.pop();
        } else {
          const nav2 = this.app.getActiveNavs()[0];
          const page = nav2.getActive().instance;
          if (page instanceof HomeDetailPage || page instanceof TicketDetailPage || page instanceof UserPage) {
            this.appMinimize.minimize();
          } else {
            nav2.pop();
          }
        }
      });
    }
  }

  private handleReservation(msg) {
    this.events.publish('R', msg);
    if (msg.content.status === 'AC') {
      this.events.publish('reservationAccepted', msg);
    } else if (msg.content.status === 'RJ') {
      this.events.publish('reservationRejected', msg);
    }
  }

  private orderDoneAlert(msg) {
    const nav = this.app._appRoot._getActivePortal() || this.app.getActiveNavs()[0];
    const activeView = nav.getActive();
    if (activeView.isOverlay) {
      return;
    }
    this.soundService.playSound();
    this.vibration.vibrate([100, 100, 100]);
    this.alertCtrl.create({
      title: msg.title,
      subTitle: msg.body,
      buttons: [
        {
          text: 'Got It',
        }
      ]
    }).present();
  }

}
