import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReorderComponent } from './reorder.component';

describe('ReorderComponent', () => {
  let component: ReorderComponent;
  let fixture: ComponentFixture<ReorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReorderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
