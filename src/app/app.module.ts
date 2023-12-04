import * as ionicGalleryModal from 'ionic-gallery-modal';
import { AngularFireModule } from '@angular/fire';
import { AuthenticationService } from '../providers/authentication/authentication.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CacheModule } from 'ionic-cache';
import { Camera } from '@ionic-native/camera';
import { CommonService } from '../providers/common/common.service';
import { DataService } from '../providers/data-service/data.service';
import { ErrorHandler, NgModule } from '@angular/core';
import { FcmService } from '../providers/fcm/fcm.service';
import { Firebase } from '@ionic-native/firebase';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { JwtHelper } from 'angular2-jwt';
import { JwtInterceptor } from '../interceptors/jwt-interceptor';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { MenuService } from '../providers/menu/menu.service';
import { MyApp } from './app.component';
import { NgxImageCompressService } from 'ngx-image-compress';
import { RestaurantService } from '../providers/restaurant/restaurant.service';
import { RetryService } from '../providers/common/retry.service';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { TagService } from '../providers/tag/tag.service';
import { TokenService } from '../providers/authentication/token.service';
import { UserService } from '../providers/user/user.service';
import { environment } from '../providers/environments/environments';
import { VoucherCommonService } from './../providers/common/voucher-common.service';
import { Vibration } from '@ionic-native/vibration';
import { NativeAudio } from '@ionic-native/native-audio';
import { SoundService } from '../providers/data-service/sound.service';
import { TranslateService } from '../providers/data-service/translate.service';
import { IntroService } from '../providers/data-service/intro.service';
import { AdsService } from './../providers/ads/ads.service';
import * as firebase from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyCwP-fqSkd5sTXPoiCJouhJ3DsTAE_6vcE',
  authDomain: 'ilovou-studio.firebaseapp.com',
  databaseURL: 'https://ilovou-studio.firebaseio.com',
  projectId: 'ilovou-studio',
  storageBucket: '',
  messagingSenderId: '1067296930553'
};

const logConfig = {
  serverLoggingUrl: `${environment.url}/v1/logs`,
  level: environment.isProd ? NgxLoggerLevel.OFF : NgxLoggerLevel.DEBUG,
  serverLogLevel: NgxLoggerLevel.ERROR
};

const ionicConfig = {
  mode: 'md',
  scrollAssist: false,
  autoFocusAssist: false,
  pageTransition: 'ios-transition',
  preloadModules: true
};

firebase.initializeApp(firebaseConfig); // Required for phone authentication

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ionicGalleryModal.GalleryModalModule,
    CacheModule.forRoot({ keyPrefix: 'Chy ' }),
    IonicStorageModule.forRoot(),
    SuperTabsModule.forRoot(),
    IonicModule.forRoot(MyApp, ionicConfig),
    AngularFireModule.initializeApp(firebaseConfig),
    LoggerModule.forRoot(logConfig)
  ],
  bootstrap: [
    IonicApp
  ],
  entryComponents: [
    MyApp
  ],
  providers: [
    NativeAudio,
    Vibration,
    AuthenticationService,
    BarcodeScanner,
    Camera,
    TranslateService,
    SoundService,
    CommonService,
    DataService,
    FcmService,
    Firebase,
    JwtHelper,
    LaunchNavigator,
    MenuService,
    NgxImageCompressService,
    RestaurantService,
    RetryService,
    SplashScreen,
    StatusBar,
    TagService,
    TokenService,
    UserService,
    VoucherCommonService,
    IntroService,
    AdsService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HAMMER_GESTURE_CONFIG, useClass: ionicGalleryModal.GalleryModalHammerConfig },
    { provide: ErrorHandler, useClass: IonicErrorHandler },
  ]
})
export class AppModule { }
