import { MemberService } from './../../../services/member.service';
import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Member } from 'src/app/models/member.model';
import moment from 'moment';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss']
})
export class MemberDetailsComponent implements OnInit {

   selectedMember$: BehaviorSubject<Member>;
   isMobile: boolean = false;

  constructor(private memberService : MemberService, private deviceDetectorService :DeviceDetectorService) { 
    this.selectedMember$ = this.memberService.getUser$();
    this.isMobile = this.deviceDetectorService.isMobile();
  }

  ngOnInit() {
  }

  calculateAge(birthday) {  
    let bdate = moment().set('year', birthday).toDate();
    var ageDifMs = Date.now() - bdate.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  
}
