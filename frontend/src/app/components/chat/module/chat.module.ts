import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonsModule } from "@progress/kendo-angular-buttons";
import { MatCardModule } from "@angular/material/card";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatButtonModule } from "@angular/material/button";
import { ChatRoutingModule } from "./chat-routing.module";
import { ChatModule } from "@progress/kendo-angular-conversational-ui";
import { Angulartics2Module } from "angulartics2";
import { ChatComponent } from "../chat.component";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [ChatComponent],
  imports: [
    CommonModule,
    SharedModule,
    ChatModule,
    ChatRoutingModule,
    ButtonsModule,
    MatCardModule,
    FlexLayoutModule,
    MatButtonModule,
    Angulartics2Module
  ],
  providers: []
})
export class PsyChatModule {}
