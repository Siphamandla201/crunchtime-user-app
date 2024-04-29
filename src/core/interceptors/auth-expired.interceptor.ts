import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtService } from "../services/jwt.service";
// import { JwtService } from '../services/services';

@Injectable({
  providedIn: 'root'
})
export class AuthExpiredInterceptor implements HttpInterceptor {
  public constructor(private readonly _jwtService: JwtService, private readonly _router: Router) {}

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap(
        () => {
          // Not applicable for a error interceptor.
        },
        (err: unknown) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              this._jwtService.logout();
              void this._router.navigate(['/']);
            }
          }
        }
      )
    );
  }
}
