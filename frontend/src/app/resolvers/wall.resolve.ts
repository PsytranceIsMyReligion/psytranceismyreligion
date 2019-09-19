import { WallService } from './../services/wall.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { MemberService } from '../services/member.service';
import { Member } from '../models/member.model';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class WallResolve implements Resolve<any> {

  constructor(private memberService: MemberService, private wallService : WallService) {}

  resolve(route: ActivatedRouteSnapshot) {
       return this.wallService.getWallPosts()
  }
}
