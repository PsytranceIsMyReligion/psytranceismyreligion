import { Socket } from "ngx-socket-io";
import { Observable, Subject, BehaviorSubject, Observer, of, ReplaySubject } from "rxjs";
import { map, tap, filter } from "rxjs/operators";
import { Injectable, OnInit } from "@angular/core";
import { User, Message } from "@progress/kendo-angular-conversational-ui";

const bot: User = {
  id: 0,
  name: "System"
};
const hello: Message = {
  author: bot,
  timestamp: new Date(),
  text: "Hello, come join the conversation!"
};

@Injectable({
  providedIn: "root"
})
export class ChatService implements OnInit {
  responses: Observable<Message> = this.socket.fromEvent<Message>(
    "chat-message"
  );
  initial: ReplaySubject<Message> = new ReplaySubject<Message>(100);

  constructor(private socket: Socket) {
    this.socket.fromEvent<Message>("chat-init").subscribe(msg => {
      this.initial.next(msg);
    })
    this.socket.emit("chat-init", []);

  }

  ngOnInit() {}

  getMessage() {
    return this.socket
      .fromEvent("chat-message")
      .pipe(tap(msg => console.log(msg)));
  }

  sendMessage(msg: Message) {
    console.log("sending", msg);
    this.socket.emit("chat-message", msg);
    this.socket.emit("system-message", msg);
  }
}
