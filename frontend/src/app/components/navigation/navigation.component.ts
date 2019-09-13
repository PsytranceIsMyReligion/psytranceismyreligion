import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService, SocialUser } from "angularx-social-login";
import { ToastrService, ActiveToast } from "ngx-toastr";
import { TokenService } from "src/app/services/token.service";
@Component({
  selector: "app-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.scss"]
})
export class NavigationComponent implements OnInit {

  constructor(
    private router: Router,
    private socialAuthService: AuthService,
    private tokenService: TokenService,
    private toastrService : ToastrService
  ) { }


  ngOnInit() {}

  logout() {
    this.socialAuthService.signOut();
    sessionStorage.removeItem("member");
    this.tokenService.logout();
    let toast : ActiveToast<any> = this.toastrService.success("Logged Out. See you soon!","Goodbye!", { timeOut : 2000 });
    toast.onHidden.subscribe(el => {
      this.router.navigate([""]);
    });
  }
  
}
