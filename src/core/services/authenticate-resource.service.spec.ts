import { TestBed } from '@angular/core/testing';

import { AuthenticateResourceService } from './authenticate-resource.service';

describe('AuthenticateResourceService', () => {
  let service: AuthenticateResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthenticateResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
