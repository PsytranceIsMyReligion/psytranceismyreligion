import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { AuthGuard } from "src/app/guards/auth.guard";
import { WatchComponent } from "../watch.component";
import { WatchResolve } from "src/app/resolvers/watch.resolve";

const routes: Routes = [
  {
    path: "",
    canActivate: [AuthGuard],
    component: WatchComponent,
    runGuardsAndResolvers: "always",
    resolve: {
      videos: WatchResolve
    }
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WatchRoutingModule {}
