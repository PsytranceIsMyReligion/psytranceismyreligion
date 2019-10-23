import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { StatsComponent } from "../stats.component";
import { AuthGuard } from "../../../guards/auth.guard";
import { RegisterResolve } from "../../../resolvers/register.resolve";

const routes: Routes = [
  {
    path: "",
    canActivate: [AuthGuard],
    component: StatsComponent,
    resolve: {
      staticdata: RegisterResolve
    }
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatsRoutingModule {}
