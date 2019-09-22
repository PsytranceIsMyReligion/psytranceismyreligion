import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { MemberService } from "../services/member.service";
import { forkJoin, empty } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class MemberListResolve implements Resolve<any> {
  constructor(private memberService: MemberService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return forkJoin([
      this.memberService.loadMembers(),
      this.memberService.landingPageStats()
    ]).pipe(
      map(result => {
        return {
          members: result[0],
          stats: result[1]
        };
      })
    );
  }
}
