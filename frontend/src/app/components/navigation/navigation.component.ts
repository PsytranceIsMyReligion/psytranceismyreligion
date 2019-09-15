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
    console.log('loging')
    this.socialAuthService.signOut();
    this.socket.emit("logof", this.memberService.getUser());
    sessionStorage.removeItem("member");
    this.tokenService.logout();
    let toast: ActiveToast<any> = this.toastrService.success(
      "Logged Out. See you soon!",
      "Goodbye!",
      { timeOut: 2000 }
    );
    toast.onHidden.subscribe(el => {
      this.router.navigate([""]);
    });
  }
}
