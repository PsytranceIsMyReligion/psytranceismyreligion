import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { WallService } from "./../services/wall.service";
import { MemberService } from "../services/member.service";
import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MemberSelectorComponent } from "../components/home/member-selector/member-selector.component";
import { FlexLayoutModule } from "@angular/flex-layout";
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
import { PopupModule } from "@progress/kendo-angular-popup";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { MatInputModule } from "@angular/material/input";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";
import { MatStepperModule } from "@angular/material/stepper";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";

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
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
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
    ButtonsModule,
    InfiniteScrollModule
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
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSidenavModule,
    MatDatepickerModule,
    MatListModule,
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
