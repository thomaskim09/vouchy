import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CacheService } from 'ionic-cache';
import { CommonService } from '../common/common.service';
import { Events } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { RetryService } from '../common/retry.service';
import { Storage } from '@ionic/storage';
import { environment } from '../environments/environments';
import { untilDestroyed } from 'ngx-take-until-destroy';
declare const ClientJS: any;
import 'clientjs';

class User {
  _id: string;
  contact: string;
  username: string;
  email: string;
  profileImage: string;
  fingerprint: number;
  deviceToken: string;
  favourites?: any;
  createdTime: string;
}

@Injectable()
export class AuthenticationService {

  url: string = environment.url;
  currentUserKey: string = 'Vouchy_Current_User';
  cacheKey: string = 'IonicCache';

  // User information
  currentUserSubject = new BehaviorSubject<User>(undefined);

  client: any;

  constructor(
    public cacheService: CacheService,
    public commonService: CommonService,
    public events: Events,
    public http: HttpClient,
    public logger: NGXLogger,
    public rs: RetryService,
    public storage: Storage) {
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  setUpUser() {
    this.client = new ClientJS();
    this.storage.get(this.currentUserKey).then(val => {
      if (val) {
        this.logger.info('Logged in');
        this.currentUserSubject = new BehaviorSubject<User>(val);
      } else {
        this.logger.info('Not logged in');
      }
    });
  }

  get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  signUp(object) {
    const api = `${this.url}/v1/users/sign-up`;
    return this.http.post<any>(api, object).pipe(untilDestroyed(this)).retryWhen(this.rs.retryFunction()).subscribe(val => {
      this.setUpCurrentUserData(val);
      this.logger.info('New signUp is called');
      this.events.publish('login', { username: object.username });
      return;
    }, err => {
      this.events.publish('loginFail', { message: err.error.error });
    });
  }

  login(object, type) {
    const api = `${this.url}/v1/users/login?type=${type}`;
    this.http.post<any>(api, object).pipe(untilDestroyed(this)).retryWhen(this.rs.retryFunction()).subscribe(val => {
      if (val.contact) {
        this.setUpCurrentUserData(val);
        this.logger.info('New passwordLogin is called');
        this.events.publish('login', { username: val.username });
      }
    }, err => {
      if (err.status === 429) {
        this.commonService.presentToast('Exceed login limit, please try again 3 mins later');
      } else {
        if (err.error) {
          this.events.publish('loginFail', { message: err.error.error });
        }
      }
    });
  }

  logout() {
    this.storage.clear();
    this.currentUserSubject.next(undefined);
    this.cacheService.clearAll();
  }

  checkLoginStatus() {
    const currentUser = this.currentUserValue;
    if (currentUser) {
      return (currentUser._id) ? true : false;
    } else {
      return false;
    }
  }

  addRemoveFavourite(type, restaurantId) {
    const currentUser = this.currentUserValue;
    if (currentUser) {
      if (type === 'add') {
        currentUser.favourites.push(restaurantId);
        this.updateCurrentUser(currentUser);
      } else {
        const index = currentUser.favourites.indexOf(restaurantId);
        if (index > -1) {
          currentUser.favourites.splice(index, 1);
          this.updateCurrentUser(currentUser);
        }
      }
    }
  }

  checkUsername(username) {
    const api = `${this.url}/v1/users/check-username`;
    const req = this.http.post<any>(api, { username: username }).map(res => {
      this.logger.info('New checkUsername called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  checkContact(contact) {
    const api = `${this.url}/v1/users/check-contact`;
    const req = this.http.post<any>(api, { contact: contact }).map(res => {
      this.logger.info('New checkContact called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  updatePassword(object) {
    const api = `${this.url}/v1/users/update-password`;
    const req = this.http.put<any>(api, object).map(res => {
      this.logger.info('New updatePassword called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  updateCurrentUser(currentUser) {
    this.currentUserSubject.next(currentUser);
    this.storage.set(this.currentUserKey, currentUser);
  }

  private setUpCurrentUserData(val) {
    if (val.favourites === undefined) {
      val.favourites = [];
    }
    const currentUserData = {
      _id: val._id,
      contact: val.contact,
      username: val.username,
      email: val.email,
      profileImage: val.profileImage,
      fingerprint: this.client.getFingerprint(),
      deviceToken: val.token,
      favourites: val.favourites,
      createdTime: val.createdTime,
    };
    this.updateCurrentUser(currentUserData);
  }
}
