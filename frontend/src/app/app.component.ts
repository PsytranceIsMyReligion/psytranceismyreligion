import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Member } from "./models/member.model";
import { AuthService, SocialUser } from "angularx-social-login";
import { TokenService } from "./services/token.service";
import { MatSnackBar } from "@angular/material";
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
    private tokenService: TokenService,
    private snackBar: MatSnackBar,
    private toastrService: ToastrService
  ) { }


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

  logout() {
    this.socialAuthService.signOut();
    sessionStorage.removeItem("member");
    this.tokenService.logout();
    let snackBarRef = this.snackBar.open("Logged Out", "OK", {
      duration: 2000
    });
    snackBarRef.afterDismissed().subscribe(() => {
      this.router.navigate([""]);
    });

  }
}
