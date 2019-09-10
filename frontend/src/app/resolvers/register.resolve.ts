import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { MemberService } from '../services/member.service';
import { Member } from '../models/member.model';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RegisterResolve implements Resolve<any> {

  constructor(private memberService: MemberService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return forkJoin([ this.memberService.getAllCountries(),
        this.memberService.getAllMusicGenres(),
        this.memberService.getMembers(),
      ]).pipe(map(result => {
        return {
            countries : result[0],
            musicGenres : result[1],
            members : result[2]
        }
      }));
  }
}