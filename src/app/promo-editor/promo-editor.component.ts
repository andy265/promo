import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {Modal} from 'ngx-modialog/plugins/vex';
import * as moment from 'moment';
import {PromoService} from '../promo.service';
import {TimerService} from '../timer.service';
import {Promo} from '../promo';

enum State {
  Create,
  Edit
}

@Component({
  selector: 'app-promo-editor',
  templateUrl: './promo-editor.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./promo-editor.component.sass']
})
export class PromoEditorComponent implements OnInit, OnDestroy {

  @ViewChild('promoForm') promoForm: NgForm;

  promo: Promo;
  state: State;
  states = State;
  startDate: Date;
  endDate: Date;
  enabledDates = {};
  isCreating = false;
  isSaving = false;
  isDeleting = false;
  isPromoChanged = false;
  remainingSecondsToStart: number;
  remainingSecondsToEnd: number;

  private isWaitingResponse = false;
  private valueChangesSubscription = new Subscription();
  private originalPromo = new Promo();
  private timerSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private promoService: PromoService,
    private modal: Modal,
    private titleService: Title,
    private timerService: TimerService
  ) { }

  ngOnInit() {
    if (this.route.snapshot.paramMap.has('id')) {
      this.titleService.setTitle('Edit promotion');
      this.state = State.Edit;
      this.loadPromo(+this.route.snapshot.paramMap.get('id'));
      this.valueChangesSubscription = this.promoForm.valueChanges.subscribe(() => this.onValueChanges());
    } else {
      this.titleService.setTitle('Create new promotion');
      this.state = State.Create;
      this.createDefaultPromo();
    }
    this.timerSubscription = this.timerService.timestamp.subscribe(timestamp => this.updateRemainingSeconds(timestamp));
  }

  ngOnDestroy() {
    this.valueChangesSubscription.unsubscribe();
    this.timerSubscription.unsubscribe();
  }

  onValueChanges() {
    this.isPromoChanged = !this.promo.isEqualTo(this.originalPromo);
  }

  onStartDateChange(date: Date) {
    this.promo.startTimestamp = moment(date).unix();
    setTimeout(() => {
      if (this.promoForm.form.controls['start'].valid) {
        this.promoForm.form.controls['end'].updateValueAndValidity();
      }
    }, 0);
  }

  onEndDateChange(date: Date) {
    this.promo.endTimestamp = moment(date).unix();
    setTimeout(() => {
      if (this.promoForm.form.controls['end'].valid) {
        this.promoForm.form.controls['start'].updateValueAndValidity();
      }
    }, 0);
  }

  updateRemainingSeconds(timestamp: number): void {
    if (!this.promo) {
      return;
    }
    this.remainingSecondsToStart = this.promo.startTimestamp - timestamp;
    this.remainingSecondsToEnd = this.promo.endTimestamp - timestamp;
  }

  markFormControlsAsTouched(form: NgForm) {
    Object.values(form.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  onCreate() {
    if (this.isWaitingResponse) {
      return;
    }
    this.isWaitingResponse = true;
    this.isCreating = true;
    this.promoService.addPromo(this.promo).subscribe(() => {
      this.isWaitingResponse = false;
      this.isCreating = false;
      this.alert(`Promotion was created. You will be redirected to promotions.`)
        .then(() => this.router.navigateByUrl('/promotions'));
    });
  }

  onSave() {
    if (this.isWaitingResponse) {
      return;
    }
    this.isWaitingResponse = true;
    this.isSaving = true;
    this.promoService.updatePromo(this.promo).subscribe(() => {
      this.isWaitingResponse = false;
      this.isSaving = false;
      this.alert(`Promotion was saved. You will be redirected to promotions.`)
        .then(() => this.router.navigateByUrl('/promotions'));
    });
  }

  onDelete() {
    if (this.isWaitingResponse) {
      return;
    }
    this.isWaitingResponse = true;
    this.isDeleting = true;
    this.promoService.deletePromo(this.promo.id).subscribe(() => {
      this.isWaitingResponse = false;
      this.isDeleting = false;
      this.alert(`Promotion was deleted. You will be redirected to promotions.`)
        .then(() => this.router.navigateByUrl('/promotions'));
    });
  }

  private loadPromo(id: number): void {
    this.promoService.getPromo(id).subscribe(promo => {
      if (promo.id !== id) {
        setTimeout(() => {
          this.alert(`There is no promotion with id=${id}. You will be redirected to promotions.`)
            .then(() => this.router.navigateByUrl('/promotions'));
        }, 0);
        return;
      }
      this.setPromo(promo);
    });
  }

  private createDefaultPromo() {
    const start = moment().seconds(0).add(5, 'm');
    const end = moment(start).add(1, 'h');
    this.setPromo(new Promo({
      name: '',
      startTimestamp: start.unix(),
      endTimestamp: end.unix()
    }));
  }

  private setPromo(promo: Promo): void {
    this.promo = promo;
    this.originalPromo = new Promo(promo);

    const start = moment.unix(promo.startTimestamp);
    const end = moment.unix(promo.endTimestamp);
    let from = moment().hours(0).minutes(0).seconds(0);
    let to = moment(from).add(1, 'y');

    if (start < from) {
      from = moment(start);
    }
    if (end >= to) {
      to = moment(end).add(1, 'd');
    }

    this.startDate = start.toDate();
    this.endDate = end.toDate();
    this.enabledDates = {
      from: from.format('YYYY-MM-DD'),
      to: to.format('YYYY-MM-DD')
    };
  }

  private alert(text: string): Promise<any> {
    return this.modal.alert()
      .className('plain')
      .showCloseButton(true)
      .message(text)
      .open()
      .result
      .catch(() => {});
  }

}
