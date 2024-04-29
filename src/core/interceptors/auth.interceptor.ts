import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
// import {JwtService} from '../services/jwt.service';
import { JwtService } from "../services/jwt.service";
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  public constructor(private readonly jwtService: JwtService) {}

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (AuthInterceptor.isNotBackendRequest(request)) {
      return next.handle(request);
    }

    const token = this.jwtService.getJwtToken();
    let updateRequest = request;

    if (token) {
      const headers = request.headers.set('authorizationToken', token);
      updateRequest = request.clone({ headers });
    }

    return next.handle(updateRequest);
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  private static isNotBackendRequest(request: HttpRequest<unknown>): boolean {
    return (
      !request ||
      !request.url ||
      (/^http/.test(request.url) && !(environment.serverApiUrl && request.url.startsWith(environment.serverApiUrl)))
    );
  }
}
