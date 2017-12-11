import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoEditorComponent } from './promo-editor.component';

describe('PromoEditorComponent', () => {
  let component: PromoEditorComponent;
  let fixture: ComponentFixture<PromoEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromoEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
