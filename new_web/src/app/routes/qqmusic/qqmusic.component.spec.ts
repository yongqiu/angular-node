import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QqmusicComponent } from './qqmusic.component';

describe('QqmusicComponent', () => {
  let component: QqmusicComponent;
  let fixture: ComponentFixture<QqmusicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QqmusicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QqmusicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
