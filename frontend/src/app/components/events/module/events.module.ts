import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared/shared.module";
import { ChartModule } from "@progress/kendo-angular-charts";
import { EventsComponent } from "../events.component";
import { EventsRoutingModule } from "./events-routing.module";

@NgModule({
  declarations: [EventsComponent],
  imports: [CommonModule, ChartModule, SharedModule, EventsRoutingModule],
  providers: []
})
export class EventsModule {}
