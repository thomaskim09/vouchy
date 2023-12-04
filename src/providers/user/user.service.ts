import lo_includes from 'lodash/includes';
import { AuthenticationService } from '../authentication/authentication.service';
import { CacheService } from 'ionic-cache';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { RetryService } from '../common/retry.service';
import { environment } from '../environments/environments';

@Injectable()
export class UserService {

  url: string = environment.url;
  cacheKey: string = 'IonicCache';
  ticketDetailCacheKey: string = 'TicketDetailsCache';
  reservationRequestCacheKey: string = 'ReservationRequestCache';
  reservationDetailCacheKey: string = 'ReservationDetailsCache';
  tempOrderListCacheKey: string = 'tempOrderListCache';

  constructor(
    public http: HttpClient,
    public cacheService: CacheService,
    public authenticationService: AuthenticationService,
    public logger: NGXLogger,
    public rs: RetryService) { }

  getUnreadTicketCount(userId) {
    const api = `${this.url}/v1/tickets/users/unread?userId=${userId}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('New getUnreadTicketCount called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  readTicket(userId) {
    const api = `${this.url}/v1/tickets/users/read?userId=${userId}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('New readTicket called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  getTicketsList(userId, status, pageSize, pageNum, refresher?) {
    const api = `${this.url}/v1/tickets/users?userId=${userId}&status=${status}&page_size=${pageSize}&page_num=${pageNum}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info(`New getTicketsList ${status} ${pageNum} called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    const ttl = 60 * 60 * 12; // 12 hours
    const cacheString = 'Vouchy_Ticket_List ' + api;
    if (refresher) {
      return this.cacheService.loadFromDelayedObservable(cacheString, req, this.cacheKey, ttl, 'all');
    }
    return this.cacheService.loadFromObservable(cacheString, req, this.cacheKey, ttl);
  }

  getTicketDetails(ticketId, type) {
    const api = `${this.url}/v1/tickets?ticketId=${ticketId}&type=${type}`;
    const req = this.http.get(api).map(res => {
      this.logger.info(`New getTicketDetails ${type} called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    return this.cacheService.loadFromObservable('Vouchy_Ticket_Details ' + api, req, this.ticketDetailCacheKey + ticketId);
  }

  getTicketQuantity(ticketId) {
    const api = `${this.url}/v1/tickets/quantity?ticketId=${ticketId}`;
    const req = this.http.get<any>(api).map(res => {
      this.cacheService.clearGroup(this.ticketDetailCacheKey + ticketId);
      this.logger.info(`New getTicketQuantity called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  getReservationNotification(userId, pageSize, pageNum, refresher) {
    const api = `${this.url}/v1/users/notifications/reservation?id=${userId}&page_size=${pageSize}&page_num=${pageNum}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info(`New getReservationNotification R ${pageNum} called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    const ttl = 60 * 60 * 12; // 12 hours
    const cacheString = 'Vouchy_Reservation_Request ' + api;
    if (refresher) {
      return this.cacheService.loadFromDelayedObservable(cacheString, req, this.reservationRequestCacheKey, ttl, 'all');
    }
    return this.cacheService.loadFromObservable(cacheString, req, this.reservationRequestCacheKey, ttl);
  }

  getReservationDetails(notificationId) {
    const api = `${this.url}/v1/reservations/details?notificationId=${notificationId}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info(`New getReservationDetails called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    const ttl = 60 * 60 * 0.25; // 15 mins
    const key = this.reservationDetailCacheKey + notificationId;
    return this.cacheService.loadFromObservable('Vouchy_Reservation_Request ' + api, req, key, ttl);
  }

  getNotification(userId, type, pageSize, pageNum, refresher) {
    const api = `${this.url}/v1/users/notifications?id=${userId}&type=${type}&page_size=${pageSize}&page_num=${pageNum}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info(`New getNotification ${type} ${pageNum} called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    const ttl = 60 * 60 * 1; // 1 hour
    const cacheString = 'Vouchy_Notifications ' + api;
    if (refresher) {
      return this.cacheService.loadFromDelayedObservable(cacheString, req, this.cacheKey, ttl, 'all');
    }
    return this.cacheService.loadFromObservable(cacheString, req, this.cacheKey, ttl);
  }

  getNotificationCount(type) {
    const currentUser = this.authenticationService.currentUserValue;
    const api = `${this.url}/v1/users/notifications/count?id=${currentUser._id}&type=${type}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info(`New getNotificationCount ${type} called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    const ttl = 60 * 60 * 0.25; // 15 mins
    return this.cacheService.loadFromObservable('Vouchy_Notifications_Count ' + api, req, this.cacheKey, ttl);
  }

  readNotifications(type) {
    const currentUser = this.authenticationService.currentUserValue;
    const api = `${this.url}/v1/users/notifications?id=${currentUser._id}&type=${type}`;
    const req = this.http.put(api, {}).map(res => {
      this.logger.info(`New readNotificationCount ${type} called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  getFavourites(favourites) {
    const currentUser = this.authenticationService.currentUserValue;
    const api = `${this.url}/v1/users/favourites?userId=${currentUser._id}`;
    const req = this.http.put<any>(api, {
      idList: favourites
    }).map(res => {
      this.logger.info('New getFavourites called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  addFavourites(restaurantId) {
    const currentUser = this.authenticationService.currentUserValue;
    const api = `${this.url}/v1/users/favourites/add?userId=${currentUser._id}`;
    const req = this.http.put(api, {
      restaurantId: restaurantId
    }).map(res => {
      this.logger.info('New addFavourites called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  removeFavourites(restaurantId) {
    const currentUser = this.authenticationService.currentUserValue;
    const api = `${this.url}/v1/users/favourites/remove?userId=${currentUser._id}`;
    const req = this.http.put(api, {
      restaurantId: restaurantId
    }).map(res => {
      this.logger.info('New removeFavourites called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  checkIsFavourited(restaurantId) {
    if (this.authenticationService.checkLoginStatus()) {
      const currentUser = this.authenticationService.currentUserValue;
      if (currentUser.favourites) {
        return lo_includes(currentUser.favourites, restaurantId);
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  changeEmail(userId, email) {
    const api = `${this.url}/v1/users/email`;
    const req = this.http.put<any>(api, {
      userId: userId,
      email: email
    }).map(res => {
      this.logger.info('New changeEmail called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  changeProfileImage(userId, image) {
    const api = `${this.url}/v1/users/image`;
    const req = this.http.put<any>(api, {
      userId: userId,
      image: image
    }).map(res => {
      this.logger.info('New changeProfileImage called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  getTreatId() {
    const api = `${this.url}/v1/treats/id`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('New getTreatId called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  sendTreats(object) {
    const api = `${this.url}/v1/treats`;
    const req = this.http.post<any>(api, object).map(res => {
      this.logger.info('New sendTreats called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  getHistoryMonths(userId) {
    const api = `${this.url}/v1/orders/history/months?id=${userId}&type=user`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('New getHistoryMonths called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return this.cacheService.loadFromObservable('Vouchy_History_Months ' + api, req, this.cacheKey);
  }

  getHistoryDays(userId, startDate, endDate) {
    const api = `${this.url}/v1/orders/history/days?id=${userId}&type=user&start_date=${startDate}&end_date=${endDate}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('New getHistoryDays called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return this.cacheService.loadFromObservable('Vouchy_History_Days ' + api, req, this.cacheKey);
  }

  getHistoryDaysOrders(userId, startDate, endDate, pageSize, pageNum) {
    const api = `${this.url}/v1/orders/history/days-orders?id=${userId}&type=user&start_date=${startDate}&end_date=${endDate}&page_size=${pageSize}&page_num=${pageNum}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info(`New getHistoryDaysOrders ${pageSize} ${pageNum} called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    return this.cacheService.loadFromObservable('Vouchy_History_Days_Orders ' + api, req, this.cacheKey);
  }

  getOrderDetails(orderId) {
    const api = `${this.url}/v1/orders?orderId=${orderId}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('New getOrderDetails called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return this.cacheService.loadFromObservable('Vouchy_Orders_Details ' + api, req, this.cacheKey);
  }

  getHistoryDaysTempOrders(fingerprint, restaurantId, startDate, endDate, pageSize, pageNum) {
    const api = `${this.url}/v1/orders/temp/history/days-orders?fingerprint=${fingerprint}&restaurantId=${restaurantId}&start_date=${startDate}&end_date=${endDate}&page_size=${pageSize}&page_num=${pageNum}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info(`New getHistoryDaysTempOrders ${pageSize} ${pageNum} called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    return this.cacheService.loadFromObservable('Vouchy_History_Days_Orders ' + api, req, this.tempOrderListCacheKey + restaurantId);
  }

  getTempOrderDetails(orderId) {
    const api = `${this.url}/v1/orders/temp/history/details?orderId=${orderId}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('New getTempOrderDetails called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return this.cacheService.loadFromObservable('Vouchy_Orders_Details ' + api, req, this.cacheKey);
  }
}
