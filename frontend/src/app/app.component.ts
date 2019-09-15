import { environment } from "./../environments/environment";
import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Member } from "./models/member.model";
import { AuthService, SocialUser } from "angularx-social-login";
import { TokenService } from "./services/token.service";
import { ToastContainerDirective, ToastrService } from "ngx-toastr";
import { Socket } from "ngx-socket-io";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnDestroy, OnInit {
  @ViewChild(ToastContainerDirective, { static: true })
  toastContainer: ToastContainerDirective;

  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private socialAuthService: AuthService,
    private tokenService: TokenService,
    private socket: Socket
  ) {}

  env = environment;

  member: Member;
  user: SocialUser;

  ngOnInit() {
    this.socialAuthService.authState.subscribe(user => {
      this.user = user;
    });
    this.socket.on("system-message", message => {
      this.toastrService.info(message, "Info");
    });
    // if(this.env.production){
    window.onbeforeunload = () => this.ngOnDestroy();
    // }
  }

  ngOnDestroy() {
    this.socialAuthService.signOut();
    sessionStorage.removeItem("member");
    this.tokenService.logout();
  }
}
