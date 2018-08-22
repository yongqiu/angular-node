import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChijiComponent } from './chiji.component';

describe('ChijiComponent', () => {
  let component: ChijiComponent;
  let fixture: ComponentFixture<ChijiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChijiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChijiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
