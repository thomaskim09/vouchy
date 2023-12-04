import { Injectable } from '@angular/core';
import { NativeAudio } from '@ionic-native/native-audio';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Storage } from '@ionic/storage';

class Sound {
  needSound: boolean;
}

@Injectable()
export class SoundService {

  // Sound information
  soundOptionKey = 'Vouplan_Sound_Option';
  currentSoundOption = new BehaviorSubject<Sound>({ needSound: true });

  constructor(
    public nativeAudio: NativeAudio,
    public storage: Storage) {
  }

  setUpSound() {
    this.storage.get(this.soundOptionKey).then(val => {
      if (val) {
        const vl = typeof val === 'string' ? JSON.parse(val) : val;
        this.currentSoundOption = new BehaviorSubject<Sound>(vl);
      }
    });
  }

  get currentSoundValue(): Sound {
    return this.currentSoundOption.value;
  }

  updateSoundUption(currentSound) {
    this.currentSoundOption.next(currentSound);
    this.storage.set(this.soundOptionKey, JSON.stringify(currentSound));
  }

  loadSound() {
    this.nativeAudio.preloadSimple('tones', 'assets/audios/tones.mp3');
  }

  playSound() {
    if (this.currentSoundValue.needSound) {
      this.nativeAudio.play('tones');
    }
  }
}
