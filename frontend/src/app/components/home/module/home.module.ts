import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "../home.component";
import { HomeRoutingModule } from "./home.routing-module";
import { SharedModule } from "../../../modules/shared.module";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, HomeRoutingModule, SharedModule],
  exports: [HomeComponent]
})
export class HomeModule {}
