import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { ChatComponent } from "../chat.component";
import { AuthGuard } from "src/app/guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    component: ChatComponent,
    canActivate: [AuthGuard]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule {}
