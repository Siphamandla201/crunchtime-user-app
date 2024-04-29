import { TestBed } from '@angular/core/testing';

import { PushNotificationResourceService } from './push-notification-resource.service';

describe('PushNotificationResourceService', () => {
  let service: PushNotificationResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PushNotificationResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
