import { Component } from '@angular/core';
import { DataService } from '../../providers/data-service/data.service';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '../../providers/data-service/translate.service';
import { IntroService } from './../../providers/data-service/intro.service';

@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {

  // HTML properties
  needTranslate: boolean = false;
  type: string;

  constructor(
    public dataService: DataService,
    public navCtrl: NavController,
    public translateService: TranslateService,
    public introService: IntroService,
    public navParams: NavParams) { }

  ngOnInit() {
    this.needTranslate = this.navParams.get('needTranslate');
    this.type = this.navParams.get('type');
  }

  toggleTranslate(ev) {
    this.processTranslate(ev.value);
  }

  processTranslate(value) {
    this.needTranslate = value;
    this.translateService.updateTranslateUption({ needTranslate: value });
    this.dataService.changeTranslate({ needTranslate: value });
  }

  exitIntro() {
    this.introService.updateIntro({ needIntro: false });
    this.back();
  }

  exitHomeIntro() {
    this.introService.updateHomeIntro({ needHomeIntro: false });
    this.back();
  }

  back() {
    this.navCtrl.pop();
  }

}
