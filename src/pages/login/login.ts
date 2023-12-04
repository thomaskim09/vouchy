import { AuthenticationService } from '../../providers/authentication/authentication.service';
import { CommonService } from '../../providers/common/common.service';
import { Component } from '@angular/core';
import { ConfirmVoucherPage } from '../confirm-voucher/confirm-voucher';
import { DataService } from '../../providers/data-service/data.service';
import { FcmService } from '../../providers/fcm/fcm.service';
import { IonicPage, NavController, NavParams, Events, AlertController, ToastController, ModalController, Platform } from 'ionic-angular';
import { Keyboard } from 'ionic-angular';
import { NGXLogger } from 'ngx-logger';
import { TicketDetailPage } from '../ticket-detail/ticket-detail';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { UserPage } from '../user/user';
declare const ClientJS: any;
import 'clientjs';
import * as firebase from 'firebase/app';
import 'firebase/auth';

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  // Parameters for successful sign in or up
  token: any;
  fingerprint: any;
  deviceDetails: any;

  // Password login properties
  contactInput: string;
  passwordInput: string;

  // Username login properties
  emailInput: string;
  newUsernameInput: string;
  newPasswordInput: string;

  // JS properties
  voucherId: string;
  lastView: any;

  // Common OTP properties
  isPasswordLogin: boolean = true;
  otpCodeInput: number;
  countDown: number;
  countDownStart: boolean = false;
  authenticated: boolean = false;

  // Tools
  intervalId: any;
  loginTimer: any;

  // OTP Sign in and up properties
  isSignInOrUp: boolean = true;
  needSpinner: boolean = false;
  otpClicked: boolean = false;
  takenName: string;

  // Forgot password properties
  isUpdatePassword: boolean = false;
  isForgotPassword: boolean = false;
  fpPasswordInput: string;
  fpPasswordAgainInput: string;

  // New user properties
  isNewUser: boolean = false;
  newUserHint: string = 'Please insert your email :)';

  // OTP authentication
  verificationId: any;

  // Controller
  timer: any;

  constructor(
    public alertCtrl: AlertController,
    public authenticationService: AuthenticationService,
    public commonService: CommonService,
    public dataService: DataService,
    public events: Events,
    public fcm: FcmService,
    public keyboard: Keyboard, // For HTML usage
    public logger: NGXLogger,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public toastCtrl: ToastController) { }

  ngOnInit() {
    this.lastView = this.navParams.get('view');
    this.voucherId = this.navParams.get('voucherId');
    if (this.platform.is('cordova')) {
      this.setupFirebaseToken();
    }
    this.listenToLoginEvents();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    this.events.unsubscribe('login');
    this.events.unsubscribe('loginFail');
    clearInterval(this.intervalId);
    clearTimeout(this.loginTimer);
    clearTimeout(this.timer);
  }

  private setupFirebaseToken() {
    this.fcm.getToken().then(val => {
      this.token = val;
    });

    const client = new ClientJS();
    this.fingerprint = client.getFingerprint();
    this.deviceDetails = {
      browser: client.getBrowser(),
      os: client.getOS(),
      osVersion: client.getOSVersion(),
      deviceType: client.getDeviceType(),
      isMobile: client.isMobile()
    };
  }

  private listenToLoginEvents() {
    this.events.subscribe('login', val => {
      this.commonService.presentToast('Welcome to Vouchy, ' + val.username, 2000);
      this.pageNavigator();
      this.timer = setTimeout(() => {
        this.needSpinner = false;
      }, 2000);
    });
    this.events.subscribe('loginFail', val => {
      this.needSpinner = false;
      this.commonService.presentToast(val.message);
    });
  }

  logUserIn() {
    this.passwordLoginFunction();
  }

  sendOTP() {
    if (!this.platform.is('cordova')) {
      return;
    }
    const textList = ['SMS code sent, please wait :)', 'SMS code receive :)'];
    let counter = 0;
    this.needSpinner = true;
    (window as any).FirebasePlugin.verifyPhoneNumber('+6' + this.contactInput, 60, credential => {
      this.commonService.presentToast(textList[counter]);
      counter++;
      this.verificationId = credential.verificationId;
      this.otpClicked = true;
      this.needSpinner = false;
      this.startCountDown();
    }, error => {
      this.needSpinner = false;
      this.commonService.presentToast('Failed to send OTP, please try again');
      this.logger.error(error);
    });
  }

  private startCountDown() {
    this.countDown = 15;
    this.countDownStart = true;
    this.intervalId = setInterval(() => {
      this.countDown -= 1;
      if (this.countDown === 0) {
        this.countDownStart = false;
        this.needSpinner = false;
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  confirmOTP() {
    // Check contact
    this.authenticationService.checkContact(this.contactInput).pipe(untilDestroyed(this)).subscribe(val => {
      if (val.length > 0) {
        if (this.isForgotPassword) {
          this.isUpdatePassword = true;
          this.authenticatedOTP();
        } else {
          this.otpLoginFunction();
        }
      } else {
        if (this.isForgotPassword) {
          const toast = this.toastCtrl.create({
            message: 'This mobile number is not registered, do you want to sign up a new one instead?',
            position: 'top',
            showCloseButton: true,
            closeButtonText: 'Sign Up'
          });
          let closedByTimeout = false;
          const timeoutHandle = setTimeout(() => { closedByTimeout = true; toast.dismiss(); }, 6000);
          toast.onDidDismiss(() => {
            if (closedByTimeout) { return; }
            clearTimeout(timeoutHandle);
            // sign up new user
            this.isNewUser = true;
            this.authenticatedOTP();
          });
          toast.present();
        } else {
          this.isNewUser = true;
          this.authenticatedOTP();
        }
      }
    });
  }

  private authenticatedOTP() {
    if (!this.platform.is('cordova')) {
      return;
    }
    this.needSpinner = true;
    const signInCredential = firebase.auth.PhoneAuthProvider.credential(this.verificationId, this.otpCodeInput.toString());
    firebase.auth().signInAndRetrieveDataWithCredential(signInCredential).then(info => {
      this.needSpinner = false;
      this.authenticated = true;
      this.commonService.presentToast('You are authenticated :)');
    }, error => {
      this.needSpinner = false;
      this.commonService.presentToast('Authentication failed');
    });
  }

  signUserUp() {
    this.alertCtrl.create({
      title: `Confirm username ${this.newUsernameInput}?`,
      subTitle: `Username will be your id, so it <b>could not be changed</b> once registered.`,
      buttons: [
        {
          text: 'Back',
          role: 'cancel',
        },
        {
          text: 'Confirm',
          handler: data => {
            this.needSpinner = true;
            // Check username
            this.authenticationService.checkUsername(this.newUsernameInput).pipe(untilDestroyed(this)).subscribe(val => {
              if (val.length > 0) {
                this.needSpinner = false;
                this.takenName = val[0].details.username;
                this.checkUsernameInput();
              } else {
                this.signUpFunction();
              }
            });
          }
        }
      ]
    }).present();
  }

  updateUserPassword() {
    this.needSpinner = true;
    const object = {
      contact: this.contactInput,
      newPassword: this.fpPasswordInput
    };
    this.authenticationService.updatePassword(object).pipe(untilDestroyed(this)).subscribe(val => {
      this.commonService.presentToast('Password updated, please login again :)');
      this.needSpinner = false;
      this.authenticated = false;
      this.isUpdatePassword = false;
      this.isForgotPassword = false;
      this.isPasswordLogin = true;
    });
  }

  private passwordLoginFunction() {
    if (this.checkPasswordLogin()) {
      this.handleLogin('password');
    }
  }

  private otpLoginFunction() {
    if (this.checkContactInput()) {
      this.handleLogin('otp');
    }
  }

  private handleLogin(type) {
    this.needSpinner = true;
    const object = {
      contact: this.contactInput,
      token: this.token,
      fingerprint: this.fingerprint,
      details: this.deviceDetails,
    };
    if (type === 'password') {
      object['password'] = this.passwordInput;
    }
    this.authenticationService.login(object, type);
    this.loginTimer = setTimeout(() => {
      this.needSpinner = false;
    }, 2000);
  }

  private signUpFunction() {
    if (this.checkUsernameInput() && this.checkPasswordInput(this.newPasswordInput)) {
      const object = {
        contact: this.contactInput,
        username: this.newUsernameInput,
        password: this.newPasswordInput,
        email: this.emailInput,
        token: this.token,
        fingerprint: this.fingerprint,
        details: this.deviceDetails,
      };
      this.authenticationService.signUp(object);
    }
  }

  switchOTPMode() {
    this.isPasswordLogin = false;
    this.isForgotPassword = false;
    this.isSignInOrUp = true;
  }

  switchForgotMode() {
    this.isPasswordLogin = false;
    this.isForgotPassword = true;
    this.isSignInOrUp = false;
  }

  switchPasswordMode() {
    this.isPasswordLogin = true;
    this.isForgotPassword = false;
    this.isSignInOrUp = false;
  }

  checkPasswordLogin() {
    if (this.checkContactInput() && this.passwordInput) {
      return true;
    } else {
      return false;
    }
  }

  checkForgotPassword() {
    if (this.checkPasswordInput(this.fpPasswordInput) && this.checkPasswordAgainInput()) {
      return true;
    } else {
      return false;
    }
  }

  checkNewUserInput() {
    if (this.checkEmail() &&
      this.checkUsernameInput() &&
      this.checkPasswordInput(this.newPasswordInput)) {
      return true;
    } else {
      return false;
    }
  }

  checkContactInput() {
    const value = this.contactInput;
    if (value) {
      if (value.length >= 10 && value.length <= 11) {
        return parsePhoneNumberFromString(value, 'MY').isValid();
      }
    }
  }

  checkCodeInput() {
    return String(this.otpCodeInput).length === 6;
  }

  private checkEmail() {
    const value = this.emailInput;
    if (value) {
      if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)) {
        this.newUserHint = 'You are ready :)';
        return true;
      } else {
        this.newUserHint = 'Need to insert a valid email';
        return false;
      }
    } else {
      this.newUserHint = 'Please insert your email :)';
      return false;
    }
  }

  private checkUsernameInput() {
    const value = this.newUsernameInput;
    if (value) {
      if (value !== this.takenName) {
        if (value.length >= 6) {
          if (value.length <= 15) {
            if (!/[^a-z0-9]/.test(value)) {
              this.newUserHint = 'You are ready :)';
              return true;
            } else {
              this.newUserHint = 'Username need all lowercase and no special character';
              return false;
            }
          } else {
            this.newUserHint = 'Username too long';
            return false;
          }
        } else {
          this.newUserHint = 'Username need at least 6 character';
          return false;
        }
      } else {
        this.newUserHint = 'Username taken, please try another one :(';
        return false;
      }
    } else {
      this.newUserHint = 'Please choose a unique username, mobile number is not recommended :)';
      return false;
    }
  }

  private checkPasswordInput(vl) {
    const value = vl;
    if (value) {
      if (value.length >= 6) {
        if (value.length <= 15) {
          this.newUserHint = 'You are ready :)';
          return true;
        } else {
          this.newUserHint = 'Password too long';
          return false;
        }
      } else {
        this.newUserHint = 'Password need at least 6 character';
        return false;
      }
    } else {
      this.newUserHint = 'Please insert a password :)';
      return false;
    }
  }

  private checkPasswordAgainInput() {
    if (this.fpPasswordAgainInput) {
      if (this.fpPasswordAgainInput === this.fpPasswordInput) {
        return true;
      } else {
        this.newUserHint = 'Two passwords are not the same';
        return false;
      }
    } else {
      this.newUserHint = 'Please type the password again';
      return false;
    }
  }

  private pageNavigator() {
    const userId = this.authenticationService.currentUserValue._id;
    if (this.lastView instanceof UserPage) {
      this.dataService.changeRefreshContent({
        userPage: true,
        userId: userId
      });
      this.navCtrl.pop();
    } else if (this.lastView instanceof ConfirmVoucherPage) {
      this.dataService.changeRefreshContent({
        voucherDetailsPage: true,
        voucherId: this.voucherId
      });
      this.navCtrl.pop().then(() => this.navCtrl.pop());
    } else if (this.lastView instanceof TicketDetailPage) {
      this.dataService.changeRefreshContent({
        ticketPage: true,
        ticketDetailPage: true,
        userId: userId
      });
      this.navCtrl.pop();
    } else {
      this.navCtrl.pop();
    }
  }

  back() {
    this.navCtrl.pop();
  }

  presentTermPicker() {
    this.modalCtrl.create('TermPickerPage').present();
  }
}
