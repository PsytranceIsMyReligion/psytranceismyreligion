import { MemberService } from './services/member.service';
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
    private memberService : MemberService,
    private socket: Socket
  ) {}

  env = environment;

  member: Member;
  user: SocialUser;

  ngOnInit() {
    this.member = this.memberService.getUser();
    this.socialAuthService.authState.subscribe(user => {
      this.user = user;
    });
    this.socket.on("system-message", message => {
      this.toastrService.info(message);
    });
    this.socket.on("chat-message", message => {
      this.toastrService.info(message.text,'Chat Message from ' + message.author.name);
    });
    // if(this.env.production){
    window.onbeforeunload = () => this.ngOnDestroy();
    // }
  }

  ngOnDestroy() {
    console.log('logoff');
    this.socket.emit("logoff", this.memberService.getUser());
    this.socialAuthService.signOut();
    sessionStorage.removeItem("member");
    this.tokenService.logout();

  }
}
