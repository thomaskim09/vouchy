import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';
import { CacheService } from 'ionic-cache';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs/Observable';
import { RetryService } from '../common/retry.service';
import { environment } from '../environments/environments';

@Injectable()
export class TagService {

  url: string = environment.url;
  cacheKey: any = 'IonicCache';
  cityResVouCacheKey: any = 'CityResVouCache';
  nearbyCacheKey: any = 'NearbyCache';

  constructor(
    public cacheService: CacheService,
    public http: HttpClient,
    public logger: NGXLogger,
    public rs: RetryService) { }

  getCitiesList() {
    const api = `${this.url}/v1/tags/address/cities`;
    const req = this.http.get(api).map(res => {
      this.logger.info('New getCitiesList called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return this.cacheService.loadFromObservable('Vouchy_Cities_List ' + api, req, this.cacheKey);
  }

  getFilterComponentList(cityId) {
    const api1 = `${this.url}/v1/tags/common-tags`;
    const api2 = `${this.url}/v1/tags/address/postcodes-all-children?cityId=${cityId}`;
    const req1 = this.http.get(api1);
    const req2 = this.http.get(api2);
    const totalReq = Observable.forkJoin([req1, req2]).map(res => {
      this.logger.info('New getFilterComponentList called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return this.cacheService.loadFromObservable('Vouchy_Filter ' + api1 + api2, totalReq);
  }

  getSearchList() {
    const api = `${this.url}/v1/searches/search-list`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('New getSearchList called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return this.cacheService.loadFromObservable('Vouchy_Search_List ' + api, req);
  }

  getNearbySearchResult(long, lat, pageSize, pageNum, refresher?) {
    const api = `${this.url}/v1/searches/nearby?long=${long}&lat=${lat}&page_size=${pageSize}&page_num=${pageNum}`;
    const req = this.http.get(api).map(res => {
      this.logger.info(`New getNearbySearchResult ${pageSize} ${pageNum} called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    const ttl = 60 * 60 * 2; // 2 hours
    const cacheString = `Vouchy_Nearby_Search_Result ${long} ${lat} ${pageNum}`;
    if (refresher) {
      this.cacheService.clearGroup(this.nearbyCacheKey);
      return this.cacheService.loadFromDelayedObservable(cacheString, req, this.nearbyCacheKey, ttl, 'all');
    }
    return this.cacheService.loadFromObservable(cacheString, req, this.nearbyCacheKey, ttl);
  }

  getSearchResult(type, id, pageSize, pageNum, long, lat) {
    const api = `${this.url}/v1/searches/query?type=${type}&input=${id}&page_size=${pageSize}&page_num=${pageNum}&long=${long}&lat=${lat}`;
    const req = this.http.get(api).map(res => {
      this.logger.info(`New getSearchResult ${pageSize} ${pageNum} called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    const ttl = 60 * 60 * 2; // 2 hours
    const lo = parseFloat(long.toFixed(2));
    const la = parseFloat(lat.toFixed(2));
    const cacheString = `Vouchy_Search_Result_One ${type} ${id} ${lo} ${la} ${pageNum}`;
    return this.cacheService.loadFromObservable(cacheString, req, this.cacheKey, ttl);
  }

  getSearchResultBatch(result, pageSize, pageNum) {
    const api = `${this.url}/v1/searches/query?page_size=${pageSize}&page_num=${pageNum}`;
    const req = this.http.post(api, result).map(res => {
      this.logger.info(`New getSearchResultBatch ${pageSize} ${pageNum} called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    const ttl = 60 * 60 * 2; // 2 hours
    // Create a unique string for each search batch
    let batchString = '';
    Object.keys(result).forEach(val => {
      result[val].map(val2 => {
        batchString += val2;
      });
    });
    const cacheString = `Vouchy_Search_Result_Batch ${batchString} ${pageNum}`;
    return this.cacheService.loadFromObservable(cacheString, req, this.cacheKey, ttl);
  }

  getSearchResultFilter(result, pageSize, pageNum) {
    const api = `${this.url}/v1/searches/query/filter?page_size=${pageSize}&page_num=${pageNum}`;
    const req = this.http.post(api, result).map(res => {
      this.logger.info(`New getSearchResultFilter ${pageSize} ${pageNum} called`);
      return res;
    }).retryWhen(this.rs.retryFunction());
    const ttl = 60 * 60 * 2; // 2 hours
    // Create a unique string for each search batch
    let batchString = '';
    Object.keys(result).forEach(val => {
      batchString += (result[val]) ? result[val] : 'null';
    });
    const cacheString = `Vouchy_Search_Result_Filter ${batchString} ${pageNum}`;
    return this.cacheService.loadFromObservable(cacheString, req, this.cacheKey, ttl);
  }
}
