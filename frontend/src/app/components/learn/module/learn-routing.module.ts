import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { AuthGuard } from "../../../guards/auth.guard";
import { LearnComponent } from "../learn.component";

const routes: Routes = [
  {
    path: "",
    canActivate: [AuthGuard],
    component: LearnComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LearnRoutingModule {}
