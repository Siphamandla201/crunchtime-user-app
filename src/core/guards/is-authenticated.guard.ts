import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
// import {JwtService} from '../services/jwt.service';
// import { JwtService } from '../services/services';
import { JwtService } from '../services/jwt.service';

@Injectable({
    providedIn: 'root'
})
export class IsAuthenticatedGuard implements CanActivate, CanLoad {
    public constructor(private readonly jwtService: JwtService, private readonly router: Router) {}

    public canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.allowAccess();
    }

    public canLoad(): Observable<boolean> | Promise<boolean> | boolean {
        return this.allowAccess();
    }

    public allowAccess(): boolean {
        const guid = this.jwtService.getJwtGuid();
        const token = this.jwtService.getJwtToken();

        if (guid && token) {
            return true;
        } else {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.router.navigate(['/unauthorized']);
            return false
        }
    }
}
