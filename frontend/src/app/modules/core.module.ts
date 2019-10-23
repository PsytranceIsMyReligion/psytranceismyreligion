import { WallService } from "./../services/wall.service";
import { LocaleService } from "./../services/locale.service";
import { MemberService } from "../services/member.service";

import { NgModule, Optional, SkipSelf } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthGuard } from "../guards/auth.guard";
import { TokenService } from "../services/token.service";
import { MemberListResolve } from "../resolvers/member-list.resolve";
import { RegisterResolve } from "../resolvers/register.resolve";
import { WatchResolve } from "../resolvers/watch.resolve";
import { WallResolve } from "../resolvers/wall.resolve";

@NgModule({
  providers: [
    AuthGuard,
    MemberService,
    TokenService,
    MemberListResolve,
    RegisterResolve,
    WatchResolve,
    WallResolve
  ]
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() core: CoreModule) {
    if(core)
      throw new Error('You shall not run!');
  }

}
