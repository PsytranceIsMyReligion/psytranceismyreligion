import { MemberService } from "./../../../services/member.service";
import { Component, OnInit, Input, Inject, LOCALE_ID } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Member, Message } from "src/app/models/member.model";
import { DeviceDetectorService } from "ngx-device-detector";
import { MatDialog } from "@angular/material/dialog";
import { MessageDialogComponent } from "./message-dialog/message-dialog.component";

@Component({
  selector: "app-member-details",
  templateUrl: "./member-details.component.html",
  styleUrls: ["./member-details.component.scss"]
})
export class MemberDetailsComponent implements OnInit {
  selectedMember$: BehaviorSubject<Member>;
  isMobile: boolean = false;

  constructor(
    private memberService: MemberService,
    @Inject(LOCALE_ID) protected localeId: string,
    private deviceDetectorService: DeviceDetectorService,
    public dialog: MatDialog,
  ) {
    this.selectedMember$ = this.memberService.getSelectedMember$();
    this.isMobile = this.deviceDetectorService.isMobile();
  }

  ngOnInit() {}

  openMessageDialog(receiver: Member): void {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      width: "650px",
      height: "600px",
      data : receiver
    });

    dialogRef.afterClosed().subscribe((message: Message) => {
      console.log('message', message);
      this.memberService.messageMember(message);

    })
  }
}
