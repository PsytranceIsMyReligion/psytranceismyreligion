import { Routes } from "@angular/router";
import { AuthGuard } from "../guards/auth.guard";
import { LandingGuard } from "../guards/landing.guard";
import { LandingComponent } from "../components/landing/landing.component";
import { ListComponent } from "../components/list/list.component";
import { StatsComponent } from "../components/stats/stats.component";
import { WatchComponent } from "../components/watch/watch.component";
import { LearnComponent } from "../components/learn/learn.component";
import { RecruitComponent } from "../components/recruit/recruit.component";
import { DiscussComponent } from "../components/discuss/discuss.component";
import { NavigationComponent } from "../components/navigation/navigation.component";
import { RegisterComponent } from "../components/register/register.component";
import { MemberListResolve } from "../resolvers/member-list.resolve";
import { RegisterResolve } from "../resolvers/register.resolve";
import { WatchResolve } from "../resolvers/watch.resolve";
export const ROUTES: Routes = [
  {
    path: "",
    runGuardsAndResolvers: "always",
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
  {
    path: "register/:mode",
    component: RegisterComponent,
    resolve: {
      data: RegisterResolve
    }
  },
  {
    path: "nav",
    component: NavigationComponent,
    children: [
      {
        path: "list",
        canActivate: [AuthGuard],
        component: ListComponent,
        resolve: {
          data: MemberListResolve
        },
        runGuardsAndResolvers: "always"
      },
      {
        path: "profile/:mode",
        component: RegisterComponent,
        resolve: {
          data: RegisterResolve
        }
      },
      {
        path: "watch",
        canActivate: [AuthGuard],
        component: WatchComponent,
        runGuardsAndResolvers: "always",
        resolve: {
          data: WatchResolve
        }
      },
      { path: "learn", canActivate: [AuthGuard], component: LearnComponent },
      { path: "stats", canActivate: [AuthGuard], component: StatsComponent },
      { path: "recruit", canActivate: [AuthGuard], component: RecruitComponent },
      { path: "discuss", canActivate: [AuthGuard], component: DiscussComponent },
      {
        path: "edit/:id",
        canActivate: [AuthGuard],
        component: RegisterComponent,
        resolve: {
          data: RegisterResolve
        }
      }
    ]
  },
  { path: "**", redirectTo: "", pathMatch: "full" }
];
