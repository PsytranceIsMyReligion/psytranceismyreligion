import { MemberService } from "./../../services/member.service";
import { Socket } from "ngx-socket-io";
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
    private toastrService: ToastrService,
    private memberService: MemberService,
    private socket: Socket
  ) {}

  ngOnInit() {}

  logout() {
    this.socialAuthService.signOut();
    // console.log('logging off', this.memberService.getUser().uname);
    this.socket.emit(
      "logoff",
      this.memberService.getUser().fname + " " + this.memberService.getUser().lname
    );
    sessionStorage.removeItem("member");
    this.tokenService.logout();
  }
}
