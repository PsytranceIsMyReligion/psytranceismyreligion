import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../modules/shared.module";
import { ChartModule } from "@progress/kendo-angular-charts";
import { RecruitComponent } from "../recruit.component";
import { RecruitRoutingModule } from "./recruit-routing.module";
@NgModule({
  declarations: [RecruitComponent],
  imports: [CommonModule, ChartModule, SharedModule, RecruitRoutingModule],
  providers: []
})
export class RecruitModule {}
