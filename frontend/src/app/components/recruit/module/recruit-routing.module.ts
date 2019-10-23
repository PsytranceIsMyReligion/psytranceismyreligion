import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { AuthGuard } from "../../../guards/auth.guard";
import { RecruitComponent } from "../recruit.component";
const routes: Routes = [
  {
    path: "",
    canActivate: [AuthGuard],
    component: RecruitComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecruitRoutingModule {}
