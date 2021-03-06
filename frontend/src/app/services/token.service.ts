import { User } from '@progress/kendo-angular-conversational-ui';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';

const baseUri =  environment.baseUri;

@Injectable()
export class TokenService {


  constructor(private http: HttpClient,  private jwtHelper: JwtHelperService) {
   }

  login(user: User): Observable<boolean> {
    return this.http.post(`${baseUri}/auth`, {id: user.id, name : user.name })
      .pipe(
        map(result => {
          localStorage.setItem('access_token', result['token']);
          console.log('added access token')
          return true;
        })
      );
  }


  logout() {
    console.log("logging out")
    localStorage.removeItem('access_token');
  }

  isTokenExpired() : boolean {
    return this.jwtHelper.isTokenExpired();
  }

  public get loggedIn(): boolean {
    return (localStorage.getItem('access_token') !== null);
  }

}
