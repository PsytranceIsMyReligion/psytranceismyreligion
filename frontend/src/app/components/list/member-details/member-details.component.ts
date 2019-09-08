import { MemberService } from './../../../services/member.service';
import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Member } from 'src/app/models/member.model';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss']
})
export class MemberDetailsComponent implements OnInit {

   selectedMember$: BehaviorSubject<Member>;

  constructor(private memberService : MemberService) { 
    this.selectedMember$ = this.memberService.getUser$();
  }

  ngOnInit() {
  }
  
}
