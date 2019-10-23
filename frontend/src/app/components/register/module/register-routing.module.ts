import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { RegisterComponent } from "../register.component";
import { RegisterResolve } from "../../../resolvers/register.resolve";

const routes: Routes = [
  {
    path: "",
    component: RegisterComponent,
    resolve: {
      staticdata: RegisterResolve
    }
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterRoutingModule {}
