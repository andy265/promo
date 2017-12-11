import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromotionsComponent } from './promotions/promotions.component';
import { PromoEditorComponent } from './promo-editor/promo-editor.component';

const routes: Routes = [
  { path: '', redirectTo: '/promotions', pathMatch: 'full' },
  { path: 'promotions', component: PromotionsComponent },
  { path: 'create', component: PromoEditorComponent },
  { path: 'edit/:id', component: PromoEditorComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
}
