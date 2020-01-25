import { CoreModule } from "./core.module";
import { WallService } from "./../services/wall.service";
import { MemberService } from "../services/member.service";
import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MemberSelectorComponent } from "../components/home/member-selector/member-selector.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import {
  MatIconModule,
  MatCardModule,
  MatStepperModule,
  MatToolbarModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatButtonModule,
  MatTableModule,
  MatDividerModule,
  MatChipsModule,
  MatAutocompleteModule,
  MatSidenavModule,
  MatDatepickerModule,
  MatListModule,
  MatRadioModule,
  MatExpansionModule
} from "@angular/material";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { WindowModule } from "@progress/kendo-angular-dialog";
import { MapComponent } from "../components/map/map.component";
import { WallComponent } from "../components/home/wall/wall.component";
import { RouterModule } from "@angular/router";
import { FilterPipeModule } from "ngx-filter-pipe";
import { SanitizeHtmlPipe } from "../pipes/sanitize-html.pipe";
import { MemberDetailsComponent } from "../components/home/member-details/member-details.component";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { ButtonsModule } from "@progress/kendo-angular-buttons";
import { LocaleService } from "../services/locale.service";
import { PostDialogComponent } from "../components/home/wall/post-dialog/post-dialog.component";
import { MessageDialogComponent } from "../components/home/member-details/message-dialog/message-dialog.component";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { VarDirective } from "../directives/var.directive";
import { TooltipModule } from "@progress/kendo-angular-tooltip";
import { PopupModule } from '@progress/kendo-angular-popup';

@NgModule({
  declarations: [
    PostDialogComponent,
    MessageDialogComponent,
    MemberSelectorComponent,
    MapComponent,
    WallComponent,
    SanitizeHtmlPipe,
    MemberDetailsComponent,
    VarDirective
  ],
  imports: [
    CommonModule,
    CKEditorModule,
    FlexLayoutModule,
    RouterModule,
    MatIconModule,
    MatCardModule,
    MatStepperModule,
    ReactiveFormsModule,
    FormsModule,
    MatToolbarModule,
    MatDialogModule,
    TooltipModule,
    PopupModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatDividerModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSidenavModule,
    MatDatepickerModule,
    MatListModule,
    MatDatepickerModule,
    MatRadioModule,
    MatExpansionModule,
    DropDownsModule,
    WindowModule,
    FilterPipeModule,
    MatMomentDateModule,
    ButtonsModule
  ],
  exports: [
    MemberSelectorComponent,
    MemberDetailsComponent,
    MapComponent,
    WallComponent,
    FlexLayoutModule,
    MatIconModule,
    MatCardModule,
    MatStepperModule,
    ReactiveFormsModule,
    FormsModule,
    PopupModule,
    MatToolbarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatDividerModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSidenavModule,
    MatDatepickerModule,
    MatListModule,
    MatDatepickerModule,
    MatRadioModule,
    MatExpansionModule,
    DropDownsModule,
    WindowModule,
    TooltipModule,
    FilterPipeModule,
    SanitizeHtmlPipe,
    MatMomentDateModule,
    ButtonsModule,
    PostDialogComponent,
    MessageDialogComponent,
    VarDirective
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
        ngModule: SharedModule,
        providers: [MemberService, WallService, LocaleService]
    };
}
}
