import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LandingRoutingModule } from "./landing-routing.module";
import { MemberService } from "src/app/services/member.service";
import { LandingComponent } from "./landing.component";
import { ButtonsModule } from "@progress/kendo-angular-buttons";
import { WindowModule } from "@progress/kendo-angular-dialog";
import { MatCardModule } from "@angular/material/card";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  declarations: [LandingComponent],
  imports: [
    CommonModule,
    LandingRoutingModule,
    ButtonsModule,
    WindowModule,
    MatCardModule,
    FlexLayoutModule,
    MatButtonModule
  ],
  providers: [MemberService]
})
export class LandingModule {}
