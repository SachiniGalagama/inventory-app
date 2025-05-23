import { TestBed } from '@angular/core/testing';

import { DashboardAiService } from './dashboard-ai.service';

describe('DashboardAiService', () => {
  let service: DashboardAiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardAiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
