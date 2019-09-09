import { MemberService } from './../../../services/member.service';
import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Member } from 'src/app/models/member.model';
import * as moment from 'moment';
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
    this.selectedMember$.subscribe(member =>
       {  
      this.memberService.getAllCountries().subscribe((list : Array<any>) => {
        console.log(list);
        console.log(list.filter(el =>  el.alpha2Code == member.origin))
        member.origin = list.filter(el =>  el.alpha2Code == member.origin)['name'];
          });
          // this.selectedMember$.next(member);
      })
  }

  calculateAge(birthday) {  
    let bdate = moment().set('year', birthday).toDate();
    var ageDifMs = Date.now() - bdate.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  
}
