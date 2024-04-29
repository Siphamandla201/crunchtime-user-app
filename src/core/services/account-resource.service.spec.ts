import { TestBed } from '@angular/core/testing';

import { AccountResourceService } from './account-resource.service';

describe('AccountResourceService', () => {
  let service: AccountResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
