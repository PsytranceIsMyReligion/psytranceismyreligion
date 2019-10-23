import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { MemberListResolve } from "../../../resolvers/member-list.resolve";
import { LandingComponent } from "../landing.component";

const routes: Routes = [
  {
    path: "",
    component: LandingComponent,
    resolve: {
      data: MemberListResolve
    }
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule {}
