import { MemberService } from "./../../services/member.service";
import { ChatService } from "./../../services/chat.service";
import { Component } from "@angular/core";

import { Subject, from, merge, Observable, of, BehaviorSubject } from "rxjs";
import { filter, map, scan, tap, switchMap } from "rxjs/operators";
import _ from "lodash";
import {
  Message,
  User,
  SendMessageEvent
} from "@progress/kendo-angular-conversational-ui";
import moment from "moment";
import { Member } from "src/app/models/member.model";
import { DeviceDetectorService } from "ngx-device-detector";
import { Angulartics2 } from "angulartics2";

@Component({
  providers: [ChatService],
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"]
})
export class ChatComponent {
  public feed$: Observable<Array<Message>>;
  loggedOnMembers$: BehaviorSubject<Array<Member>>;
  headerInfo$: BehaviorSubject<String>;
  chatHeaderInfo$: BehaviorSubject<String>;
  isMobile = false;
  public readonly user: User = {
    id: 1
  };

  public readonly bot: User = {
    id: 0,
    name: "System"
  };

  private local: Subject<Message> = new Subject<Message>();

  constructor(
    private svc: ChatService,
    private memberService: MemberService,
    private deviceDetectorService: DeviceDetectorService,
    private angulartics2: Angulartics2

  ) {
    this.user.name = this.memberService.getUser().uname;
    this.user.avatarUrl = this.memberService.getUser().avatarUrl;
    this.user.id = Math.random();
    this.isMobile = deviceDetectorService.isMobile();
    const hello: Message = {
      author: this.bot,
      timestamp: new Date(),
      text: "Hello, come join the conversation!"
    };
    this.loggedOnMembers$ = this.memberService.loggedOnMembers$;
    this.chatHeaderInfo$ = new BehaviorSubject(
      "We have " +
        this.memberService.loggedOnMembers$.getValue().length +
        " Logged on Members"
    );
    this.feed$ = merge(
      from([hello]),
      this.local,
      this.svc.initial.pipe(
        filter(res => res != null),
        map(
          (response): Message => {
            response.timestamp = moment(response.timestamp).toDate();
            return response;
          }
        ),
        tap(res => console.log("init2", res))
      ),
      this.svc.responses.pipe(
        filter(res => res != null),
        map(
          (response): Message => {
            response.timestamp = moment(response.timestamp).toDate();
            return response;
          }
        )
      )
    ).pipe(
      // tap(res => console.log(res)),
      scan((acc, x) => [...acc, x], [])
      // tap(res => console.log(res))
    );
  }

  public sendMessage(e: SendMessageEvent): void {
    this.local.next(e.message);
    this.svc.sendMessage(e.message);
    this.angulartics2.eventTrack.next({ 
      action: 'ChatAction', 
      properties: { sender: e.message.author.name },
    });
  }
}
