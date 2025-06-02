import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextWeekInventoryComponent } from './next-week-inventory.component';

describe('NextWeekInventoryComponent', () => {
  let component: NextWeekInventoryComponent;
  let fixture: ComponentFixture<NextWeekInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NextWeekInventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NextWeekInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
