import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Storage } from '@ionic/storage';

class Translate {
  needTranslate: boolean;
}

@Injectable()
export class TranslateService {

  // Translate information
  translateOptionKey = 'PWA_Translate_Option';
  currentTranslateOption = new BehaviorSubject<Translate>({ needTranslate: false });
  currentTranslateOptionValue = this.currentTranslateOption.asObservable();

  constructor(public storage: Storage) { }

  setUpTranslate() {
    this.storage.get(this.translateOptionKey).then(val => {
      if (val) {
        const vl = typeof val === 'string' ? JSON.parse(val) : val;
        this.currentTranslateOption = new BehaviorSubject<Translate>(vl);
      }
    });
  }

  get currentTranslateValue(): Translate {
    return this.currentTranslateOption.value;
  }

  updateTranslateUption(current) {
    this.currentTranslateOption.next(current);
    this.storage.set(this.translateOptionKey, JSON.stringify(current));
  }
}
