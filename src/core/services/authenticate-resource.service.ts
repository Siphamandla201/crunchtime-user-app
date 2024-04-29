import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
// import {JwtService} from "./services";
import { JwtService } from './jwt.service';
import {IAuthenticateModel} from "../models/authenticate.model";
import {catchError} from "rxjs/operators";
import {IJwtTokenModel} from "../models/jwt-token.model";

@Injectable({
  providedIn: 'root'
})
export class AuthenticateResourceService {
  private readonly _resourceUrl: string = environment.serverApiUrl + '/authenticate';

  public constructor(private readonly _http: HttpClient,
    private readonly _jwtService: JwtService) {}

    public async authenticate(model: IAuthenticateModel): Promise<IJwtTokenModel> {
      try {
        const response = await this._http.post<IJwtTokenModel>(this._resourceUrl, model).toPromise();
        if (!response) {
          throw new Error('Authentication failed.'); // Throw an error if the response is falsy
        }
        return response;
      } catch (error) {
        throw error;
      }
    }

  public async authenticateChat(username: string, chatSid: string){
    try {
      const authToken: string | null= localStorage.getItem('jwtToken');
      if (authToken === null) {
        throw new Error('JWT token not found in local storage.');
      }
      const options = {
        headers: new HttpHeaders({
          Authorization: authToken
        })
      };
      return await this._http.post<string>(environment.serverApiUrl + '/converstion/' + chatSid + '/' + username + '/create-token', '', options).toPromise();
    } catch (error) {
      throw error;
    }
  }
}
