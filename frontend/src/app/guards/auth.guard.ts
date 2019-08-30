import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      if (localStorage.getItem('access_token')) {
        // logged in so return true
            console.log('Auth Guard found token - you are logged in')
            return true;
        }        
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/landing']);
        console.log('Auth Guard no token - redirecting to login')
        return false;
    }
}
