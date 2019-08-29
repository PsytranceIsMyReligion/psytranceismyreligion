import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      console.log('auth guard')
      if (localStorage.getItem('access_token')) {
        // logged in so return true
            console.log('guard - lged in ')
            return true;
        }        
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/landing']);
        return false;
    }
}
