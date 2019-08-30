import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Member } from "./models/member.model";
import { AuthService, SocialUser } from "angularx-social-login";
import { TokenService } from "./services/token.service";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnDestroy, OnInit {
  constructor(
    private router: Router,
    private socialAuthService: AuthService,
    private tokenService: TokenService
  ) {}

  member: Member;
  user: SocialUser;

  ngOnInit() {
    this.socialAuthService.authState.subscribe(user => {
      this.user = user;
    });
    window.onbeforeunload = () => this.ngOnDestroy();
  }

  navigateToProfile() {
    this.member = JSON.parse(sessionStorage.getItem("member"));
    this.router.navigate(["/nav/edit/" + this.member._id]);
  }

  ngOnDestroy() {
    console.log("logout");
    this.socialAuthService.signOut();
    sessionStorage.removeItem("member");
    this.tokenService.logout();
  }
}
