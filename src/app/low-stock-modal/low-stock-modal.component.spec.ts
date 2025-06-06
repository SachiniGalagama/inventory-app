import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LowStockModalComponent } from './low-stock-modal.component';

describe('LowStockModalComponent', () => {
  let component: LowStockModalComponent;
  let fixture: ComponentFixture<LowStockModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LowStockModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LowStockModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
