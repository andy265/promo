import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as moment from 'moment';

@Injectable()
export class TimerService {
  timestamp: BehaviorSubject<number> = new BehaviorSubject(moment().unix());

  constructor() {
    this.nextTick();
    setInterval(() => this.nextTick(), 1000);
  }

  private nextTick (): void {
    this.timestamp.next(moment().unix());
  }
}
