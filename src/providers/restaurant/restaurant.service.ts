import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';
import { CacheService } from 'ionic-cache';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { RetryService } from '../common/retry.service';
import { environment } from '../environments/environments';

@Injectable()
export class RestaurantService {

  url: string = environment.url;
  cacheKey: string = 'IonicCache';
  voucherCacheKey: string = 'resVouCache';
  voucherDeCacheKey: string = 'VoucherDetailsCache';
  ticketDetailCacheKey: string = 'TicketDetailsCache';
  reservationRequestCacheKey: string = 'ReservationRequestCache';
  reservationDetailCacheKey: string = 'ReservationDetailsCache';
  reservationCheckCacheKey: string = 'ReservationCheckCache';
  feedbackCheckCacheKey: string = 'FeedbackCheckCache';

  constructor(
    public cacheService: CacheService,
    public http: HttpClient,
    public logger: NGXLogger,
    public rs: RetryService) { }

  getRestaurantDetails(restaurantId, type) {
    const api = `${this.url}/v1/restaurants/users?type=details&restaurantId=${restaurantId}`;
    const req = this.http.post<any>(api, {
      type: type
    }).map(res => {
      this.logger.info(`New getRestaurantDetails called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    const ttl = 60 * 60 * 1; // 1 hour
    return this.cacheService.loadFromObservable('Vouchy_Restaurant_Details ' + api, req, this.cacheKey, ttl);
  }

  getRestaurantDetailsSegment(restaurantId, type) {
    const api = `${this.url}/v1/restaurants/users?type=segment &restaurantId=${restaurantId}`;
    const req = this.http.post(api, {
      type: type
    }).map(res => {
      this.logger.info('New getRestaurantDetailsSegment called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    const ttl = 60 * 60 * 1; // 1 hour
    return this.cacheService.loadFromObservable('Vouchy_Restaurant_Detail_Segment ' + api, req, this.cacheKey, ttl);
  }

  getRestaurantDetailVouchers(restaurantId) {
    const api = `${this.url}/v1/vouchers/restaurants/users?type=details&restaurantId=${restaurantId}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('New getRestaurantDetailVouchers called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    // const ttl = 60 * 60 * 1; // 1 hour
    // return this.cacheService.loadFromObservable('Vouchy_Restaurant_Details_Voucher ' + api, req, this.voucherCacheKey, ttl);
    return req;
  }

  getVouchersTitle(restaurantId) {
    const api = `${this.url}/v1/vouchers/restaurants/users?type=title&restaurantId=${restaurantId}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('New getVouchersTitle called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    const ttl = 60 * 60 * 0.5; // 30 minues
    return this.cacheService.loadFromObservable('Vouchy_Voucher_Titles ' + api, req, this.cacheKey, ttl);
  }

  getVoucherDetails(voucherId, userId?, refresher?) {
    const api = `${this.url}/v1/vouchers/users?voucherId=${voucherId}&userId=${userId}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info(`New getVoucherDetails ${voucherId} called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    const ttl = 60 * 60 * 24; // 1 day
    const cacheString = `Vouchy_Voucher_Details ${voucherId}`;
    const cacheKey = `${this.voucherDeCacheKey} ${voucherId}`;
    if (refresher) {
      return this.cacheService.loadFromDelayedObservable(cacheString, req, cacheKey, ttl, 'all');
    }
    return this.cacheService.loadFromObservable(cacheString, req, cacheKey, ttl);
  }

  createNewTicketVoucher(ticket, type) {
    const api = `${this.url}/v1/tickets/vouchers?type=${type}`;
    const req = this.http.post(api, ticket).map(res => {
      this.logger.info(`New createNewTicketVoucher ${type} called`);
      this.cacheService.clearGroup(`${this.voucherDeCacheKey} ${ticket.voucherId}`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  updateVoucherSoldOnly(voucherId, userId, quantity) {
    const api = `${this.url}/v1/vouchers/quantity?voucherId=${voucherId}&userId=${userId}`;
    const req = this.http.post(api, { quantity: quantity }).map(res => {
      this.logger.info(`New updateVoucherSoldOnly ${quantity} called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  getRestaurantReservationInfo(restaurantId) {
    const api = `${this.url}/v1/reservations/restaurants/users?restaurantId=${restaurantId}`;
    const req = this.http.get(api).map(res => {
      this.logger.info('New getRestaurantReservationInfo called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    const ttl = 60 * 60 * 1; // 1 hour
    return this.cacheService.loadFromObservable('Vouchy_Reservation_Settings ' + api, req, this.cacheKey, ttl);
  }

  createReservation(object) {
    const api = `${this.url}/v1/reservations/users`;
    const req = this.http.post<any>(api, { object: object }).map(res => {
      this.cacheService.clearGroup(this.reservationRequestCacheKey);
      this.logger.info('New createReservation called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  checkReservationNotification(notificationId) {
    const api = `${this.url}/v1/reservations/status?notificationId=${notificationId}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('New checkReservationNotification called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return this.cacheService.loadFromObservable('Vouchy_Reservation_Check ' + api, req, this.reservationCheckCacheKey + notificationId);
  }

  checkReservation(notificationId, status) {
    const api = `${this.url}/v1/reservations/check?notificationId=${notificationId}&status=${status}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('New checkReservation called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  cancelReservation(notificationId, object) {
    const api = `${this.url}/v1/reservations?notificationId=${notificationId}`;
    const req = this.http.put<any>(api, object).map(res => {
      if (object.status === 'CT') {
        this.cacheService.clearGroup(this.reservationCheckCacheKey + notificationId);
      }
      this.cacheService.clearGroup(this.reservationDetailCacheKey + notificationId);
      this.cacheService.clearGroup(this.reservationRequestCacheKey);
      this.logger.info(`New cancelReservation ${object.status} called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  getFeedbacks(type, id, pageSize, pageNum) {
    const api = `${this.url}/v1/feedbacks/users?${type}=${id}&page_size=${pageSize}&page_num=${pageNum}`;
    const req = this.http.get(api).map(res => {
      this.logger.info(`New getFeedbacks ${pageSize} ${pageNum} called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    const ttl = 60 * 60 * 1; // 1 hour
    return this.cacheService.loadFromObservable('Vouchy_Feedbacks ' + api, req, this.cacheKey, ttl);
  }

  createFeedbacks(feedback) {
    const api = `${this.url}/v1/feedbacks/`;
    const req = this.http.post<any>(api, feedback).map(res => {
      this.logger.info('New createFeedbacks called');
      this.cacheService.clearGroup(this.feedbackCheckCacheKey + feedback.ticketId);
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  cancelFeedback(ticketId) {
    const api = `${this.url}/v1/feedbacks/cancel?ticketId=${ticketId}`;
    const req = this.http.put<any>(api, {}).map(res => {
      this.logger.info('New cancelFeedback called');
      this.cacheService.clearGroup(this.feedbackCheckCacheKey + ticketId);
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  checkFeedback(ticketId) {
    const api = `${this.url}/v1/feedbacks/check?ticketId=${ticketId}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('New checkFeedbacks called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return this.cacheService.loadFromObservable('Vouchy_Feedbacks_Check ' + api, req, this.feedbackCheckCacheKey + ticketId);
  }

  checkVoucherAvailability(voucherId, userId, quantity) {
    const api = `${this.url}/v1/vouchers/users?voucherId=${voucherId}&userId=${userId}`;
    const req = this.http.post<any>(api, { quantity: quantity }).map(res => {
      this.logger.info('checkVoucherAvailability called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }

  checkVoucherFree(voucherId) {
    const api = `${this.url}/v1/vouchers/free?voucherId=${voucherId}`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('checkVoucherFree called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return req;
  }
}
