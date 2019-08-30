import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

@Injectable()
export class LandingGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (sessionStorage.getItem("member")) {
      // logged in so return true
      console.log("Member found - logged in redirecting to list page");
      this.router.navigate(["nav/list"]);
    }
    // not logged in so redirect to login page with the return url
    return true;
  }
}
