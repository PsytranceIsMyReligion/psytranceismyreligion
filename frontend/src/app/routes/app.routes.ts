import { WallResolve } from "./../resolvers/wall.resolve";
import { Routes } from "@angular/router";
import { AuthGuard } from "../guards/auth.guard";
import { LandingComponent } from "../components/landing/landing.component";
import { HomeComponent } from "../components/home/home.component";
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
    path: "landing",
    component: LandingComponent,
    resolve: {
      data: MemberListResolve
    }
  },
  {
    path: "nav",
    component: NavigationComponent,
    children: [
      {
        path: "register/:mode",
        component: RegisterComponent,
        resolve: {
          staticdata: RegisterResolve
        }
      },
      {
        path: "home",
        canActivate: [AuthGuard],
        component: HomeComponent,
        resolve: {
          data: MemberListResolve,
          posts: WallResolve
        }
        // runGuardsAndResolvers: "always"
      },
      {
        path: "home/:id",
        canActivate: [AuthGuard],
        component: HomeComponent,
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
          staticdata: RegisterResolve
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
          staticdata: RegisterResolve
        }
      },
      {
        path: "recruit",
        canActivate: [AuthGuard],
        component: RecruitComponent
      }
    ]
  },
  { path: "**", redirectTo: "/landing", pathMatch: "full" }
];
