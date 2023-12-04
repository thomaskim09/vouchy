import 'rxjs/add/operator/map';
import { AuthenticationService } from '../authentication/authentication.service';
import { CacheService } from 'ionic-cache';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { RetryService } from '../common/retry.service';
import { environment } from '../environments/environments';

@Injectable()
export class MenuService {

  url: string = environment.url;
  cacheKey: any = 'IonicCache';
  tempOrderListCacheKey: string = 'tempOrderListCache';

  constructor(
    public authenticationService: AuthenticationService,
    public cacheService: CacheService,
    public http: HttpClient,
    public logger: NGXLogger,
    public rs: RetryService) { }

  getMenu(restaurantId) {
    const api = `${this.url}/v1/menus/restaurants?restaurantId=${restaurantId}`;
    const req = this.http.get(api).map(res => {
      this.logger.info('New getMenu called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    const ttl = 60 * 60 * 0.5; // 30 minutes
    return this.cacheService.loadFromObservable('Vouchy_Food_Category ' + api, req, this.cacheKey, ttl);
  }

  getFoodList(menuId, categoryId, pageSize, pageNum) {
    const api = `${this.url}/v1/menus/categories/users?menuId=${menuId}&categoryId=${categoryId}&page_size=${pageSize}&page_num=${pageNum}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info(`New getFoodList ${categoryId} ${pageNum} called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    const ttl = 60 * 60 * 0.5; // 30 minutes
    return this.cacheService.loadFromObservable('Vouchy_Food_List ' + api, req, this.cacheKey, ttl);
  }

  getFoodSearchList(menuId) {
    const api = `${this.url}/v1/menus/users?menuId=${menuId}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('New getFoodSearchList called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    const ttl = 60 * 60 * 0.5; // 30 minutes
    return this.cacheService.loadFromObservable('Vouchy_Food_Search_List ' + api, req, this.cacheKey, ttl);
  }

  getFoodDetails(menuId, foodId) {
    const api = `${this.url}/v1/menus/foods/users?menuId=${menuId}&foodId=${foodId}`;
    const req = this.http.get(api).map(res => {
      this.logger.info('New getFoodDetails called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return this.cacheService.loadFromObservable('Vouchy_Food_Details ' + api, req, this.cacheKey);
  }

  checkTableStatus(fingerprint, restaurantId, tableNo) {
    const api = `${this.url}/v1/orders/temp/check_table?fingerprint=${fingerprint}&restaurantId=${restaurantId}&tableNo=${tableNo}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('New checkTableStatus called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  sendOrderInfo(content) {
    const api = `${this.url}/v1/orders/temp`;
    const req = this.http.post<any>(api, { content: content }).map(res => {
      this.logger.info('New sendOrderInfo called');
      this.cacheService.clearGroup(this.tempOrderListCacheKey + content.restaurantId);
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  getOrderDetails(orderId) {
    const api = `${this.url}/v1/orders/temp?orderId=${orderId}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('New getOrderDetails called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return this.cacheService.loadFromObservable('Vouchy_Temp_Order_Details ' + api, req, this.cacheKey);
  }

  checkOrderStatus(orderId, status) {
    const api = `${this.url}/v1/orders/temp/check?orderId=${orderId}&status=${status}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('New checkOrderStatus called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  changeOrderStatus(object) {
    object.username = this.authenticationService.currentUserValue.username;
    const api = `${this.url}/v1/orders/temp/status?orderId=${object.orderId}`;
    const req = this.http.put<any>(api, object).map(res => {
      this.logger.info(`New changeOrderStatus ${object.status} called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  getTempOrderStatus(orderId) {
    const api = `${this.url}/v1/orders/temp/status?orderId=${orderId}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('New getTempOrderStatus called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  needService(content) {
    const api = `${this.url}/v1/orders/call`;
    const req = this.http.post<any>(api, {
      content: content
    }).map(res => {
      this.logger.info('New needService called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }
}
