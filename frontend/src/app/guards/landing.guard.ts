import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from "@angular/router";

@Injectable()
export class LandingGuard implements CanActivate {
  constructor(private router: Router, private route : ActivatedRoute) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (sessionStorage.getItem("member")) {
      // logged in so return true
      console.log(route)
      console.log("Member found - logged in redirecting to list page", route.paramMap);
      if (!route.params.id) this.router.navigate(["home"], { relativeTo : this.route.parent});
    }
    // not logged in so redirect to login page with the return url
    return true;
  }
}
