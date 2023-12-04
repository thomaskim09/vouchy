import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class RetryService {

  retryFunction() {
    return error => error.flatMap(error2 => {
      if (error2.status === 401) {
        return Observable.of(error2);
      }
      return Observable.throw(error2);
    }).take(2).delay(1000);
  }
}
