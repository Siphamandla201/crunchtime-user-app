import { TestBed } from '@angular/core/testing';

import { DriverResourceService } from './driver-resource.service';

describe('DriverResourceService', () => {
  let service: DriverResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DriverResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
