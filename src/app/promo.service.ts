import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/takeWhile';
import { BehaviorSubject  } from 'rxjs/BehaviorSubject';
import { of } from 'rxjs/observable/of';
import { catchError, map } from 'rxjs/operators';
import {TimerService} from './timer.service';
import { Promo } from './promo';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class PromoService {
  private promotionsUrl = '/api/promotions';

  constructor(
    private http: HttpClient,
    private timerService: TimerService
  ) { }

  getActualPromotions(): Observable<Promo[]> {
    const promotions$ = new BehaviorSubject<Promo[]>([]);
    this.http.get<Promo[]>(this.promotionsUrl).pipe(
      catchError(this.handleError<Promo[]>([]))
    ).subscribe(promotions => {
      const now = this.timerService.timestamp.getValue();
      const allPromotions: Promo[] = promotions
        .filter(promo => promo.endTimestamp > now)
        .map(promo => new Promo(promo));
      let currentPromotions: Promo[] = allPromotions.filter(promo => promo.startTimestamp <= now);
      let furtherPromotions: Promo[] = allPromotions.filter(promo => promo.startTimestamp > now);
      currentPromotions = currentPromotions.sort((p1, p2) => p1.endTimestamp - p2.endTimestamp);
      furtherPromotions = furtherPromotions.sort((p1, p2) => p1.startTimestamp - p2.startTimestamp);
      this.timerService.timestamp.takeWhile(() => promotions$.observers.length > 0).subscribe(timestamp => {
        // add from further
        for (let i = 0; i < furtherPromotions.length; i++) {
          const promo = furtherPromotions[i];
          if (promo.startTimestamp > timestamp) {
            break;
          }
          currentPromotions.push(promo);
          furtherPromotions.splice(i, 1);
          i--;
        }
      });
      promotions$.next(currentPromotions);
    });
    return promotions$.asObservable();
  }

  getPromo(id: number): Observable<Promo> {
    const url = `${this.promotionsUrl}/${id}`;
    return this.http.get<Promo>(url).pipe(
      map(promo => new Promo(promo)),
      catchError(this.handleError<Promo>(new Promo()))
    );
  }

  addPromo(promo: Promo): Observable<Promo> {
    return this.http.post<Promo>(this.promotionsUrl, promo, httpOptions).pipe(
      catchError(this.handleError<Promo>(new Promo()))
    );
  }

  deletePromo(id: number): Observable<Promo> {
    const url = `${this.promotionsUrl}/${id}`;
    return this.http.delete<Promo>(url, httpOptions).pipe(
      catchError(this.handleError<Promo>(new Promo()))
    );
  }

  updatePromo(promo: Promo): Observable<Promo> {
    return this.http.put(this.promotionsUrl, promo, httpOptions).pipe(
      catchError(this.handleError<any>(new Promo()))
    );
  }

  private handleError<T>(result?: T) {
    return (): Observable<T> => {
      // TODO: redirect to error page when real server will be used
      return of(result as T);
    };
  }
}
