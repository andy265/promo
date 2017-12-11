import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'remainingTime'
})
export class RemainingTimePipe implements PipeTransform {

  constructor() { }

  transform(remainingSeconds: number, position = 'inline'): string {
    if (remainingSeconds <= 0) {
      remainingSeconds = 0;
    }
    const duration = moment.duration(remainingSeconds, 'seconds');
    const days = this.getLabel(duration.asDays(), 'day');
    const hours = this.getLabel(duration.hours(), 'hour');
    const minutes = this.getLabel(duration.minutes(), 'minute');
    const seconds = this.getLabel(duration.seconds(), 'second');
    if (position === 'multiline') {
      const multiline = duration.format(`dd [${days}]|hh [${hours}]|mm [${minutes}]|ss [${seconds}]`, { trim: false }).split('|');
      return multiline.map(line => `<div>${line}</div>`).join('');
    }
    const inline = duration.format(`dd [${days}] hh [${hours}] mm [${minutes}] ss [${seconds}]`, { trim: false });
    return `<span>${inline}</span>`;
  }

  private getLabel(count: number, oneLabel: string): string {
    return (count >= 1 && count < 2) ? `${oneLabel}&nbsp;` : `${oneLabel}s`;
  }

}
