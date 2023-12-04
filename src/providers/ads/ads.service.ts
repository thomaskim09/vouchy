import 'rxjs/add/operator/map';
import { CacheService } from 'ionic-cache';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { RetryService } from '../common/retry.service';
import { environment } from '../environments/environments';

@Injectable()
export class AdsService {

  url: string = environment.url;
  cacheKey: any = 'IonicCache';

  constructor(
    public cacheService: CacheService,
    public http: HttpClient,
    public logger: NGXLogger,
    public rs: RetryService) { }

  getVouchersAds() {
    const api = `${this.url}/v1/ads/vouchers`;
    const req = this.http.get<any>(api).map(res => {
      this.logger.info('New getVouchersAds called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return this.cacheService.loadFromObservable('Vouchy_Vouchers_Ads ' + api, req, this.cacheKey);
  }

  getSearchAds() {
    const api = `${this.url}/v1/ads/tags`;
    const req = this.http.get(api).map(res => {
      this.logger.info('New getSearchAds called');
      return res;
    }).retryWhen(this.rs.retryFunction());
    return this.cacheService.loadFromObservable('Vouchy_Ads ' + api, req, this.cacheKey);
  }

}
