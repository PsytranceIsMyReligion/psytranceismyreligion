import { MemberService } from './../../../services/member.service';
import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Member } from 'src/app/models/member.model';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-member-selector',
  templateUrl: './member-selector.component.html',
  styleUrls: ['./member-selector.component.scss']
})
export class MemberSelectorComponent implements OnInit {

  selectedMember$: BehaviorSubject<Member>;
  @Input("members$") members$: BehaviorSubject<Array<Member>>;
  @Input("headerInfo$") headerInfo$ : BehaviorSubject<any>;
  isMobile : boolean = false;
  constructor(private memberService : MemberService,     private deviceDetectorService :DeviceDetectorService ) 
  {
    this.selectedMember$ = this.memberService.getUser$();
    this.isMobile = this.deviceDetectorService.isMobile();
    
  }

  ngOnInit() {
    console.log("members", this.members$)
    console.log("hear", this.headerInfo$)
  }

  focusMember(member) {
    this.selectedMember$.next(member);
  }


  
}
