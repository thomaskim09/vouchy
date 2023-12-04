import { CommonService } from '../providers/common/common.service';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TokenService } from '../providers/authentication/token.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    public commonService: CommonService,
    public tokenService: TokenService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const tokenValue = this.tokenService.currentTokenValue;
    if (tokenValue.isAuthenticated) {
      request = request.clone({
        setHeaders: {
          'Authorization': tokenValue.token
        }
      });
    }
    if (!request.headers.has('Content-Type')) {
      request = request.clone({
        setHeaders: {
          'content-type': 'application/json'
        }
      });
    }
    request = request.clone({
      headers: request.headers.set('Accept', 'application/json')
    });
    return next.handle(request).pipe(tap(success => { }, error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        this.tokenService.getNewToken();
        return next.handle(request);
      } else {
        if (error.status === 0) {
          this.commonService.presentToast('Server is not responding');
        }
        return Observable.throw(error);
      }
    }));
  }
}
