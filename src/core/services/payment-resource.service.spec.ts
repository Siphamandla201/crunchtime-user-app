import { TestBed } from '@angular/core/testing';

import { PaymentResourceService } from './payment-resource.service';

describe('PaymentResourceService', () => {
  let service: PaymentResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
