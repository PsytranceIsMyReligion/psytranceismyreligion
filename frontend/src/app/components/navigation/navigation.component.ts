import { MemberService } from "./../../services/member.service";
import { Socket } from "ngx-socket-io";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "angularx-social-login";
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
    private memberService: MemberService,
    private socket: Socket
  ) {}

  ngOnInit() {}

  logout() {
    this.socialAuthService.signOut();
    this.socket.emit("logoff", this.memberService.getUser());
    sessionStorage.removeItem("member");
    this.tokenService.logout();
    this.router.navigate(['/landing'])
  }
}
