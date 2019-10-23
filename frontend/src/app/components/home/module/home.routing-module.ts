import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { AuthGuard } from "src/app/guards/auth.guard";
import { HomeComponent } from "../home.component";
import { MemberListResolve } from "src/app/resolvers/member-list.resolve";
import { WallResolve } from "src/app/resolvers/wall.resolve";

const routes: Routes = [
  {
    path: "",
    canActivate: [AuthGuard],
    component: HomeComponent,
    resolve: {
      data: MemberListResolve,
      posts: WallResolve
    }
  },
  {
    path: ":id",
    canActivate: [AuthGuard],
    component: HomeComponent,
    resolve: {
      data: MemberListResolve,
      posts: WallResolve
    }
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
