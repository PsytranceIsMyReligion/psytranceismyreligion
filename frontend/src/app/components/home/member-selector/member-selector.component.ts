import { Router } from '@angular/router';
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
    private router : Router
  ) {
    this.selectedMember$ = this.memberService.getSelectedMember$();
    this.isMobile = this.deviceDetectorService.isMobile();
  }

  focusMember(member) {
    this.selectedMember$.next(member);
  }

  focusOnMap(member) {
    console.log('fouc')
    this.selectedMember$.next(member);
    this.router.navigate(['list']);
  }
}
