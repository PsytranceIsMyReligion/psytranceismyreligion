import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RegisterRoutingModule } from "./register-routing.module";
import { RegisterComponent } from "../register.component";
import { SharedModule } from "../../../modules/shared.module";
import { UploadModule } from "@progress/kendo-angular-upload";
import { AvatarDialogComponent } from "../avatar-dialog/avatar-dialog.component";
import { StaticDataDialogComponent } from "../staticdata-dialog/staticdata-dialog.component";

@NgModule({
  entryComponents: [AvatarDialogComponent, StaticDataDialogComponent],
  declarations: [
    RegisterComponent,
    AvatarDialogComponent,
    StaticDataDialogComponent
  ],
  imports: [CommonModule, RegisterRoutingModule, SharedModule, UploadModule]
})
export class RegisterModule {}
