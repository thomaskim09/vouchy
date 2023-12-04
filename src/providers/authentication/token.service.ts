import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelper } from 'angular2-jwt';
import { NGXLogger } from 'ngx-logger';
import { Storage } from '@ionic/storage';
import { environment } from '../environments/environments';
import { untilDestroyed } from 'ngx-take-until-destroy';

class Token {
  isAuthenticated: boolean;
  token: string;
}

@Injectable()
export class TokenService {

  url: string = environment.url;
  tokenKey: string = 'Access_Token';

  // Token information
  currentTokenSubject = new BehaviorSubject<Token>({
    isAuthenticated: false,
    token: undefined
  });

  constructor(
    public http: HttpClient,
    public jwtHelper: JwtHelper,
    public logger: NGXLogger,
    public storage: Storage) { }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  setUpToken() {
    this.storage.get(this.tokenKey).then(val => {
      if (val) {
        const isExpired = this.jwtHelper.isTokenExpired(val);
        if (!isExpired) {
          this.logger.info('Token still valid');
          this.currentTokenSubject.next({
            isAuthenticated: true,
            token: val
          });
        } else {
          this.getNewToken();
        }
      } else {
        this.getNewToken();
      }
    });
  }

  get currentTokenValue(): Token {
    return this.currentTokenSubject.value;
  }

  getNewToken() {
    const api = `${this.url}/v1/tokens`;
    this.http.get<any>(api).pipe(untilDestroyed(this)).subscribe(val => {
      this.updateTokenStorage(val);
      return;
    });
  }

  getNewTokenRequest() {
    const api = `${this.url}/v1/tokens`;
    return this.http.get<any>(api).pipe(untilDestroyed(this));
  }

  updateTokenStorage(val) {
    this.logger.info('New access token is called');
    this.storage.set(this.tokenKey, val.token);
    this.currentTokenSubject.next({
      isAuthenticated: true,
      token: val.token
    });
  }

}
