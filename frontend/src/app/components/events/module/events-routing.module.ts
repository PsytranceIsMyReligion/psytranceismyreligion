import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { AuthGuard } from "../../../guards/auth.guard";
import { EventsComponent } from "../events.component";

const routes: Routes = [
  {
    path: "",
    canActivate: [AuthGuard],
    component: EventsComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule {}
