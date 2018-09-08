import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class TokenService {

  uri = 'http://localhost:4000';

  constructor(private http: HttpClient,  private jwtHelper: JwtHelperService) { }

  login(socialid: string): Observable<boolean> {
    return this.http.post<{token: string}>(`${this.uri}/api/auth`, {socialid: socialid})
      .pipe(
        map(result => {
          localStorage.setItem('access_token', result.token);
          return true;
        })
      );
  }

  logout() {
    localStorage.removeItem('access_token');
  }

  isTokenExpired() : boolean {
    return this.jwtHelper.isTokenExpired();
  }

  public get loggedIn(): boolean {
    return (localStorage.getItem('access_token') !== null);
  }
}
