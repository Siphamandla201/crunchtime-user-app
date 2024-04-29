import { TestBed } from '@angular/core/testing';

import { DistanceCalculatorResourceService } from './distance-calculator-resource.service';

describe('DistanceCalculatorResourceService', () => {
  let service: DistanceCalculatorResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DistanceCalculatorResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
