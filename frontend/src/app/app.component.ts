import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Member } from "./models/member.model";
import { AuthService, SocialUser } from "angularx-social-login";
import { TokenService } from "./services/token.service";
import { ToastContainerDirective, ToastrService } from "ngx-toastr";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnDestroy, OnInit {

  @ViewChild(ToastContainerDirective, {static: true}) toastContainer: ToastContainerDirective;

  constructor(
    private router: Router,
    private socialAuthService: AuthService,
    private tokenService: TokenService
  ) { }


  member: Member;
  user: SocialUser;

  ngOnInit() {
    this.socialAuthService.authState.subscribe(user => {
      this.user = user;
    });
    window.onbeforeunload = () => this.ngOnDestroy();
  }

  ngOnDestroy() {
    this.socialAuthService.signOut();
    sessionStorage.removeItem("member");
    this.tokenService.logout();
  }


}
