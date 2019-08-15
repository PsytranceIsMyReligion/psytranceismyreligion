import { Routes } from "@angular/router";
import { AuthGuard } from "../guards/auth.guard";
import { LandingGuard } from "../guards/landing.guard";
import { LandingComponent } from "../components/landing/landing.component";
import { ListComponent } from "../components/list/list.component";
import { WatchComponent } from "../components/watch/watch.component";
import { LearnComponent } from "../components/learn/learn.component";
import { RecruitComponent } from "../components/recruit/recruit.component";
import { ListenComponent } from "../components/listen/listen.component";
import { DiscussComponent } from "../components/discuss/discuss.component";
import { NavigationComponent } from "../components/navigation/navigation.component";
import { RegisterComponent } from "../components/register/register.component";
import { MemberListResolve } from "../resolvers/member-list.resolve";

export const ROUTES: Routes = [
  {
    path: "landing",
    component: LandingComponent,
    canActivate: [LandingGuard],
    resolve: {
      data: MemberListResolve
    }
  },
  {
    path: "home",
    component: LandingComponent,
    resolve: {
      data: MemberListResolve
    }
  },
  { path: "register/:mode", component: RegisterComponent },
  {
    path: "nav",
    canActivate: [AuthGuard],
    component: NavigationComponent,
    children: [
      {
        path: "list",
        canActivate: [AuthGuard],
        component: ListComponent,
        resolve: {
          data: MemberListResolve
        }
      },
      { path: "watch", canActivate: [AuthGuard], component: WatchComponent },
      { path: "learn", canActivate: [AuthGuard], component: LearnComponent },
      { path: "listen", canActivate: [AuthGuard], component: ListenComponent },
      { path: "recruit", canActivate: [AuthGuard], component: RecruitComponent },
      { path: "discuss", canActivate: [AuthGuard], component: DiscussComponent },
      { path: "edit/:id", canActivate: [AuthGuard], component: RegisterComponent }
    ]
  },
  { path: "**", redirectTo: "landing", pathMatch: "full" }
];
