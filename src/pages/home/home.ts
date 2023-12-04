import { AuthenticationService } from '../../providers/authentication/authentication.service';
import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { IonicPage, Events, AlertController, App, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserService } from '../../providers/user/user.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { DataService } from './../../providers/data-service/data.service';
import { CommonService } from './../../providers/common/common.service';
import { TicketDetailPage } from '../ticket-detail/ticket-detail';
import { UserPage } from '../user/user';
import { Vibration } from '@ionic-native/vibration';
import { HomeDetailPage } from '../home-detail/home-detail';
import lo_isEmpty from 'lodash/isEmpty';
import { IntroService } from './../../providers/data-service/intro.service';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [InAppBrowser]
})
export class HomePage {

  pages: any = [
    { pageName: 'HomeDetailPage', icon: 'custom-home-outline-thin', id: 'homeTab' },
    { pageName: 'TicketPage', icon: 'custom-ticket-outline', id: 'ticketTab' },
    { pageName: 'UserPage', icon: 'custom-user-outline', id: 'userTab' }
  ];

  // HTML properties
  homeTabBadge: number = 0;
  ticketTabBadge: number = 0;
  userTabBadge: number = 0;

  constructor(
    public app: App,
    public alertCtrl: AlertController,
    public authenticationService: AuthenticationService,
    public events: Events,
    public iab: InAppBrowser,
    public storage: Storage,
    public userService: UserService,
    public dataService: DataService,
    public commonService: CommonService,
    public vibration: Vibration,
    public introService: IntroService,
    public navCtrl: NavController) { }

  ngOnInit() {
    this.listenToCheckTicket();
    this.listenToTicketRefresh();
    this.listenToHomeNotification();
    this.listenToReservationNotification();
    this.listenToReservationRefresh();
    setTimeout(() => {
      this.checkIfNeedIntro();
      this.getUnreadTicketCount();
    }, 1000);
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    this.events.unsubscribe('login');
    this.events.unsubscribe('ticketPurchased');
    this.events.unsubscribe('reservationAccepted');
    this.events.unsubscribe('reservationRejected');
  }

  private listenToCheckTicket() {
    this.subscribeCheckTicket('login');
    this.subscribeListenTicket('ticketPurchased');
    this.subscribeListenTicket('reservationAccepted', true);
  }

  private listenToTicketRefresh() {
    this.dataService.currentRefreshContent.pipe(untilDestroyed(this)).subscribe(val => {
      if (!lo_isEmpty(val)) {
        if (val.ticketPage && val.userId) {
          this.readTicket();
        }
      }
    });
  }

  private listenToHomeNotification() {
    this.dataService.currentCommonNoti.pipe(untilDestroyed(this)).subscribe(val => {
      if (!lo_isEmpty(val)) {
        const nav2 = this.app.getActiveNavs()[0];
        const page = nav2.getActive().instance;
        if (page instanceof TicketDetailPage || page instanceof UserPage) {
          this.homeTabBadge += 1;
          this.commonService.presentToast('');
        }
      }
    });
  }

  private listenToReservationNotification() {
    this.events.subscribe('reservationRejected', () => {
      const nav2 = this.app.getActiveNavs()[0];
      const page = nav2.getActive().instance;
      if (page instanceof HomeDetailPage || page instanceof TicketDetailPage || page instanceof UserPage) {
        this.vibration.vibrate([100, 100, 100]);
        this.userTabBadge += 1;
        this.commonService.presentToast('');
      }
    });
  }

  private listenToReservationRefresh() {
    this.events.subscribe('reservationRefresh', () => {
      this.removeUserBadge();
    });
  }

  private subscribeCheckTicket(type) {
    this.events.subscribe(type, () => {
      this.getUnreadTicketCount();
    });
  }

  private subscribeListenTicket(type, vibration?) {
    this.events.subscribe(type, () => {
      if (vibration) {
        this.vibration.vibrate([100, 100, 100]);
      }
      this.ticketTabBadge += 1;
      this.commonService.presentToast('');
    });
  }

  private getUnreadTicketCount() {
    if (this.authenticationService.checkLoginStatus()) {
      const currentUser = this.authenticationService.currentUserValue;
      this.userService.getUnreadTicketCount(currentUser._id).pipe(untilDestroyed(this)).subscribe(val => {
        if (val[0].count > 0) {
          this.vibration.vibrate([100, 100, 100]);
        }
        this.ticketTabBadge = val[0].count;
        this.commonService.presentToast('');
      });
    }
  }

  private checkIfNeedIntro() {
    if (this.introService.currentHomeIntroValue.needHomeIntro) {
      this.navCtrl.push('IntroPage', {
        needTranslate: false,
        type: 'home'
      });
    }
  }

  removeHomeBadge() {
    if (this.homeTabBadge !== 0) {
      this.homeTabBadge = 0;
    }
  }

  readTicket() {
    if (this.ticketTabBadge !== 0 && this.ticketTabBadge !== undefined) {
      if (this.authenticationService.checkLoginStatus()) {
        const currentUser = this.authenticationService.currentUserValue;
        this.userService.readTicket(currentUser._id).pipe(untilDestroyed(this)).subscribe(val => {
          this.ticketTabBadge = 0;
        });
      }
    }
  }

  removeUserBadge() {
    if (this.userTabBadge !== 0) {
      this.userTabBadge = 0;
    }
  }
}
