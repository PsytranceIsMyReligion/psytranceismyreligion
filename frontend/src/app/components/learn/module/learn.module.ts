import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../modules/shared.module";
import { ChartModule } from "@progress/kendo-angular-charts";
import { LearnComponent } from "../learn.component";
import { LearnRoutingModule } from "./learn-routing.module";

@NgModule({
  declarations: [LearnComponent],
  imports: [CommonModule, ChartModule, SharedModule, LearnRoutingModule],
  providers: []
})
export class LearnModule {}
