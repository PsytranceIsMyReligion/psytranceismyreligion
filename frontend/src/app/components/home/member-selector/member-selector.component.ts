import { Angulartics2 } from 'angulartics2';
import { Router, ActivatedRoute } from "@angular/router";
import { MemberService } from "./../../../services/member.service";
import { Component, OnInit, Input } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { Member } from "src/app/models/member.model";
import { DeviceDetectorService } from "ngx-device-detector";

@Component({
  selector: "app-member-selector",
  templateUrl: "./member-selector.component.html",
  styleUrls: ["./member-selector.component.scss"]
})
export class MemberSelectorComponent {
  selectedMember$: BehaviorSubject<Member>;
  @Input("members$") members$: BehaviorSubject<Array<Member>>;
  @Input("headerInfo$") headerInfo$: BehaviorSubject<any>;
  @Input("chatHeaderInfo$") chatHeaderInfo$: BehaviorSubject<any>;

  isMobile: boolean = false;
  constructor(
    private memberService: MemberService,
    private deviceDetectorService: DeviceDetectorService,
    private router: Router,
    private route: ActivatedRoute,
    private angulartics2: Angulartics2
  ) {
    this.selectedMember$ = this.memberService.getSelectedMember$();
    this.isMobile = this.deviceDetectorService.isMobile();
  }

  focusMember(member) {
    this.selectedMember$.next(member);
    this.angulartics2.eventTrack.next({
      action: 'FocusMemberAction',
      properties: { member: member.uname },
    });
  }

  focusOnMap(member) {
    this.selectedMember$.next(member);
    this.router.navigate(["/nav/home"]);
  }
}
