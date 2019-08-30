import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';

@Injectable()
export class TokenService {

  env : any;

  constructor(private http: HttpClient,  private jwtHelper: JwtHelperService) {
    this.env = environment;
   }

  login(id: string): Observable<boolean> {
    return this.http.post<{token: string}>(`${this.env.baseUri}/api/auth`, {id: id})
      .pipe(
        map(result => {
          localStorage.setItem('access_token', result.token);
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
