import { TestBed } from '@angular/core/testing';

import { CategoryResourceService } from './category-resource.service';

describe('CategoryResourceService', () => {
  let service: CategoryResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
