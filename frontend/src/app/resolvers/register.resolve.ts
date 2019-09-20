import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { MemberService } from "../services/member.service";
import { StaticData } from "../models/member.model";
import { of } from "rxjs";
import { switchMap } from "rxjs/operators";

@Injectable()
export class RegisterResolve implements Resolve<any> {
  constructor(private memberService: MemberService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.memberService.getStaticData().pipe(
      switchMap((res: StaticData[]) => {
        let artists = Array.from(res as Array<StaticData>).filter(el => el.type == "artist");
        let festivals = Array.from(res as Array<StaticData>).filter(el => el.type == "festival");
        let musicGenres = Array.from(res as Array<StaticData>).filter(
          el => el.type == "musicgenre"
        );
        return of({ artists: artists, festivals: festivals, musicGenres: musicGenres });
      })
    );
  }
}
