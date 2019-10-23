import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MemberSelectorComponent } from "../home/member-selector/member-selector.component";
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
import { MapComponent } from "../map/map.component";
import { WallComponent } from "../home/wall/wall.component";
import { RouterModule } from "@angular/router";
import { FilterPipeModule } from "ngx-filter-pipe";
import { SanitizeHtmlPipe } from "src/app/pipes/sanitize-html.pipe";
import { MemberDetailsComponent } from "../home/member-details/member-details.component";

@NgModule({
  declarations: [
    MemberSelectorComponent,
    MapComponent,
    WallComponent,
    SanitizeHtmlPipe,
    MemberDetailsComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    RouterModule,
    MatIconModule,
    MatCardModule,
    MatStepperModule,
    ReactiveFormsModule,
    FormsModule,
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
    FilterPipeModule
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
    FilterPipeModule,
    SanitizeHtmlPipe
  ]
})
export class SharedModule {}
