import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MemberService } from "src/app/services/member.service";
import { ButtonsModule } from "@progress/kendo-angular-buttons";
import { MatCardModule } from "@angular/material/card";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatButtonModule } from "@angular/material/button";
import { ChatComponent } from "@progress/kendo-angular-conversational-ui";
import { ChatRoutingModule } from "./chat-routing.module";
import { ChatService } from "src/app/services/chat.service";
import { DeviceDetectorService } from "ngx-device-detector";
import { ChatModule } from "@progress/kendo-angular-conversational-ui";
import { Angulartics2 } from "angulartics2";

@NgModule({
  declarations: [ChatComponent],
  imports: [
    CommonModule,
    ChatModule,
    ChatRoutingModule,
    ButtonsModule,
    MatCardModule,
    FlexLayoutModule,
    MatButtonModule,
    Angulartics2
  ],
  providers: [MemberService, ChatService, DeviceDetectorService]
})
export class PsyChatModule {}
