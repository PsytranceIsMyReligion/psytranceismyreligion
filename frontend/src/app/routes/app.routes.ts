import { Routes } from "@angular/router";
import { NavigationComponent } from "../components/navigation/navigation.component";
export const ROUTES: Routes = [
  {
    path: "landing",
    loadChildren: () =>
      import("../components/landing/module/landing.module").then(
        m => m.LandingModule
      )
  },
  {
    path: "nav",
    component: NavigationComponent,
    children: [
      {
        path: "register/:mode",
        loadChildren: () =>
          import("../components/register/module/register.module").then(
            m => m.RegisterModule
          )
      },
      {
        path: "home",
        loadChildren: () =>
          import("../components/home/module/home.module").then(
            m => m.HomeModule
          )
      },
      // {
      //   path: "home/:id",
      //   loadChildren: () => import(`../components/home/module/home.module`).then(m => m.HomeModule)
      // },
      {
        path: "profile/:mode",
        loadChildren: () =>
          import("../components/register/module/register.module").then(
            m => m.RegisterModule
          )
      },
      {
        path: "watch",
        loadChildren: () =>
          import("../components/watch/module/watch.module").then(
            m => m.WatchModule
          )
      },
      {
        path: "chat",
        loadChildren: () =>
          import("../components/chat/module/chat.module").then(
            m => m.PsyChatModule
          )
      },
      {
        path: "events",
        loadChildren: () =>
          import("../components/events/module/events.module").then(
            m => m.EventsModule
          )
      },
      {
        path: "learn",
        loadChildren: () =>
          import("../components/learn/module/learn.module").then(
            m => m.LearnModule
          )
      },

      {
        path: "stats",
        loadChildren: () =>
          import("../components/stats/module/stats.module").then(
            m => m.StatsModule
          )
      },
      {
        path: "recruit",
        loadChildren: () =>
          import("../components/recruit/module/recruit.module").then(
            m => m.RecruitModule
          )
      }
    ]
  },
  { path: "**", redirectTo: "/landing", pathMatch: "full" }
];
