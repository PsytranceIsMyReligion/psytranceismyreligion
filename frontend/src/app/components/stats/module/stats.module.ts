import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StatsComponent } from "../stats.component";
import { StatsRoutingModule } from "./stats-routing.module";
import { SharedModule } from "../../../modules/shared.module";
import { ChartModule } from "@progress/kendo-angular-charts";

@NgModule({
  declarations: [StatsComponent],
  imports: [
    CommonModule,
    ChartModule,
    SharedModule,
    StatsRoutingModule,
  ],
  providers: []
})
export class StatsModule {}
