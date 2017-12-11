import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Observable} from 'rxjs/Observable';
import {PromoService} from '../promo.service';
import {Promo} from '../promo';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.sass']
})
export class PromotionsComponent implements OnInit {
  promotions$: Observable<Promo[]>;

  constructor(
    private promoService: PromoService,
    private titleService: Title
  ) { }

  ngOnInit () {
    this.titleService.setTitle('Promotions');
    this.promotions$ = this.promoService.getActualPromotions();
  }

  trackByFn(index, item): number {
    return item.id;
  }
}
