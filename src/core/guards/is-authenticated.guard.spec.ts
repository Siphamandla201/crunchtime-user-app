import { TestBed } from '@angular/core/testing';

import { IsAuthenticatedGuard } from './is-authenticated.guard';
import { JwtService } from 'src/core/services/services';
import { JwtServiceStub } from '../../test-utils/services';
import { RouterTestingModule } from '@angular/router/testing';

describe('IsAuthenticatedGuard', () => {
    let guard: IsAuthenticatedGuard;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: JwtService,
                    useClass: JwtServiceStub
                }
            ],
            imports: [RouterTestingModule]
        });
        guard = TestBed.inject(IsAuthenticatedGuard);
    });

    it('should be created', async () => {
        await expect(guard).toBeTruthy();
    });
});
