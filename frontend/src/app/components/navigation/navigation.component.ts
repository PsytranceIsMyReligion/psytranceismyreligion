import { MemberService } from "./../../services/member.service";
import { Socket } from "ngx-socket-io";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "angularx-social-login";
import { TokenService } from "src/app/services/token.service";
import { MatSidenav } from "@angular/material";

@Component({
  selector: "app-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.scss"]
})
export class NavigationComponent implements OnInit {
  isMember: boolean = false;
  constructor(
    private router: Router,
    private socialAuthService: AuthService,
    private tokenService: TokenService,
    private memberService: MemberService,
    private socket: Socket
  ) {}

  ngOnInit() {
    this.isMember = this.memberService.isMember();
  }

  logout() {
    this.socialAuthService.signOut();
    console.log(
      "logging off with ",
      JSON.parse(sessionStorage.getItem("login-record"))
    );
    this.socket.emit(
      "logoff",
      JSON.parse(sessionStorage.getItem("login-record"))
    );
    sessionStorage.removeItem("member");
    this.tokenService.logout();
    setTimeout(() => {
      this.router.navigate(["/landing"]);
    }, 500);
  }
}
