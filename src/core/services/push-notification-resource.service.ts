import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {ErrorDetails} from '../models/error-details';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationResourceService {
  private readonly resourceUrl: string = environment.serverApiUrl + '/push-notification';

  constructor(
    private readonly http: HttpClient
  ) {}

  public async saveToken(token: string, userPlatform: string): Promise<void> {
    if (!token) { return; }

    const data = {
      deviceToken: token,
      platform: userPlatform,
      enableNotification: true,
      apnsToken: ''
    };

    // send the user token to the api
    try {
      const authToken: string | null= localStorage.getItem('jwtToken');
      if(!authToken) {
        throw new Error('JWT token not found in local storage.');
      }
      const options = {
        headers: new HttpHeaders({
          Authorization: authToken
        })
      };

      return this
        .http
        .put<void>(this.resourceUrl + '/register-user-device', data, options)
        .toPromise();
    } catch (error: any) {
      if (error && error instanceof ProgressEvent) {
        throw new ErrorDetails('A connection could not be established. Please contact an administrator.',
          'Contact Administrator', '', undefined);
      }
      throw new ErrorDetails(error.error.detail, error.error.title || error.error.detail,
        error.error.status, error.error.timeStamp);
    }
  }
}
