import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { MemberService } from '../services/member.service';

@Injectable()
export class RegisterResolve implements Resolve<any> {

  constructor(private memberService: MemberService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return  this.memberService.getStaticData();
  }
}
