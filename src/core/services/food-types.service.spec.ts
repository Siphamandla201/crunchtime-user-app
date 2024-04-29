import { TestBed } from '@angular/core/testing';

import { FoodTypesService } from './food-types.service';

describe('FoodTypesService', () => {
  let service: FoodTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoodTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
