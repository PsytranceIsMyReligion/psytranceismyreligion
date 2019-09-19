import { WallResolve } from "./../resolvers/wall.resolve";
import { Routes } from "@angular/router";
import { AuthGuard } from "../guards/auth.guard";
import { LandingGuard } from "../guards/landing.guard";
import { LandingComponent } from "../components/landing/landing.component";
import { ListComponent } from "../components/list/list.component";
import { StatsComponent } from "../components/stats/stats.component";
import { WatchComponent } from "../components/watch/watch.component";
import { LearnComponent } from "../components/learn/learn.component";
import { RecruitComponent } from "../components/recruit/recruit.component";
import { NavigationComponent } from "../components/navigation/navigation.component";
import { RegisterComponent } from "../components/register/register.component";
import { MemberListResolve } from "../resolvers/member-list.resolve";
import { RegisterResolve } from "../resolvers/register.resolve";
import { WatchResolve } from "../resolvers/watch.resolve";
import { ChatComponent } from "../components/chat/chat.component";
import { EventsComponent } from "../components/events/events.component";
export const ROUTES: Routes = [
  {
    path: "",
    // runGuardsAndResolvers: "always",
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
          data: MemberListResolve,
          posts: WallResolve
        }
        // runGuardsAndResolvers: "always"
      },
      {
        path: "list/:id",
        canActivate: [AuthGuard],
        component: ListComponent,
        resolve: {
          data: MemberListResolve,
          wallposts: WallResolve
        }
        // runGuardsAndResolvers: "always"
      },
      {
        path: "profile/:mode",
        canActivate: [AuthGuard],
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
          videos: WatchResolve
        }
      },
      { path: "events", canActivate: [AuthGuard], component: EventsComponent },
      { path: "learn", canActivate: [AuthGuard], component: LearnComponent },
      { path: "chat", canActivate: [AuthGuard], component: ChatComponent },
      {
        path: "stats",
        canActivate: [AuthGuard],
        component: StatsComponent,
        resolve: {
          data: RegisterResolve
        }
      },
      {
        path: "recruit",
        canActivate: [AuthGuard],
        component: RecruitComponent
      },
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
