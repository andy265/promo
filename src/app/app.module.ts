import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { MomentModule } from 'angular2-moment';
import 'moment-duration-format';
import { FlatpickrModule, FLATPICKR } from 'angularx-flatpickr';
import * as flatpickr from 'flatpickr';
import { ModalModule } from 'ngx-modialog';
import { VexModalModule } from 'ngx-modialog/plugins/vex';
import { ResponsiveModule } from 'ngx-responsive';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PromotionsComponent } from './promotions/promotions.component';
import { PromoComponent } from './promo/promo.component';
import { PromoEditorComponent } from './promo-editor/promo-editor.component';
import { TheFooterComponent } from './the-footer/the-footer.component';
import { InMemoryDataService } from './in-memory-data.service';
import { PromoService } from './promo.service';
import { TimerService } from './timer.service';
import { CompareWithDateValidatorDirective } from './compare-with-date.directive';
import { RemainingTimePipe } from './remaining-time.pipe';


@NgModule({
  declarations: [
    AppComponent,
    PromotionsComponent,
    PromoComponent,
    PromoEditorComponent,
    CompareWithDateValidatorDirective,
    TheFooterComponent,
    RemainingTimePipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    FlatpickrModule.forRoot({
      provide: FLATPICKR,
      useFactory: () => flatpickr
    }),
    AngularFontAwesomeModule,
    MomentModule,
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    ),
    ModalModule.forRoot(),
    VexModalModule,
    ResponsiveModule
  ],
  providers: [
    PromoService,
    TimerService,
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
