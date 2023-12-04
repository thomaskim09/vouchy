import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

class Intro {
  needIntro: boolean;
}

class HomeIntro {
  needHomeIntro: boolean;
}

@Injectable()
export class IntroService {

  currentIntroSubject = new BehaviorSubject<Intro>({ needIntro: true });
  introKey: string = 'VouchyIntroKey';

  currentHomeIntroSubject = new BehaviorSubject<HomeIntro>({ needHomeIntro: true });
  homeIntroKey: string = 'VouchyHomeIntroKey';

  constructor(public storage: Storage) { }

  setUpIntro() {
    this.storage.get(this.introKey).then(val => {
      this.currentIntroSubject = new BehaviorSubject<Intro>({
        needIntro: val ? val.needIntro : true
      });
    });
    this.storage.get(this.homeIntroKey).then(val => {
      this.currentHomeIntroSubject = new BehaviorSubject<HomeIntro>({
        needHomeIntro: val ? val.needHomeIntro : true
      });
    });
  }

  get currentIntroValue(): Intro {
    return this.currentIntroSubject.value;
  }

  get currentHomeIntroValue(): HomeIntro {
    return this.currentHomeIntroSubject.value;
  }

  updateIntro(value) {
    this.currentIntroSubject.next(value);
    this.storage.set(this.introKey, value);
  }

  updateHomeIntro(value) {
    this.currentHomeIntroSubject.next(value);
    this.storage.set(this.homeIntroKey, value);
  }
}
