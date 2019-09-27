import { Angulartics2GoogleAnalytics } from "angulartics2/ga";
import { MemberService } from "./services/member.service";
import { environment } from "./../environments/environment";
import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
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
    private toastrService: ToastrService,
    private socialAuthService: AuthService,
    private tokenService: TokenService,
    private memberService: MemberService,
    private socket: Socket,
    private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics
  ) {
    angulartics2GoogleAnalytics.startTracking();
  }

  env = environment;

  member: Member;

  ngOnInit() {
    this.member = this.memberService.getUser();
    this.socket.on("system-message", message => {
      console.log("system-message", message);
      if (message.trim() != "") this.toastrService.info(message);
    });
    this.socket.on("login-record", record => {
      console.log("login-record", record);
      sessionStorage.setItem("login-record", JSON.stringify(record));
    });
    this.socket.on("chat-message", message => {
      this.toastrService.info(
        message.text,
        "Chat Message from " + message.author.name
      );
    });
    // if(this.env.production){
    window.onbeforeunload = () => this.ngOnDestroy();
    // }
  }

  ngOnDestroy() {
    console.log("logoff");
    this.socket.emit(
      "logoff",
      JSON.parse(sessionStorage.getItem("login-record"))
    );
    this.socialAuthService.signOut();
    sessionStorage.removeItem("member");
    this.tokenService.logout();
  }
}
