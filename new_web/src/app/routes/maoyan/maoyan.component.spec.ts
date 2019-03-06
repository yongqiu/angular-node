import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaoyanComponent } from './maoyan.component';

describe('MaoyanComponent', () => {
  let component: MaoyanComponent;
  let fixture: ComponentFixture<MaoyanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaoyanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaoyanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
