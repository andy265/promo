import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {TimerService} from '../timer.service';
import {Promo} from '../promo';

@Component({
  selector: 'app-promo',
  templateUrl: './promo.component.html',
  styleUrls: ['./promo.component.sass']
})
export class PromoComponent implements OnInit, OnDestroy {

  @Input() promo: Promo;
  remainingSeconds: number;

  private timerSubscription: Subscription;

  constructor(private timerService: TimerService) { }

  ngOnInit() {
    this.timerSubscription = this.timerService.timestamp.subscribe(timestamp => this.updateRemainingSeconds(timestamp));
  }

  ngOnDestroy() {
    this.timerSubscription.unsubscribe();
  }

  updateRemainingSeconds(timestamp: number): void {
    this.remainingSeconds = this.promo.endTimestamp - timestamp;
    if (this.remainingSeconds <= 0) {
      this.timerSubscription.unsubscribe();
    }
  }

}
