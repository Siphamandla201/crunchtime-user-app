import { TestBed } from '@angular/core/testing';

import { BankingDetailsResourceService } from './banking-details-resource.service';

describe('BankingDetailsResourceService', () => {
  let service: BankingDetailsResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BankingDetailsResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
