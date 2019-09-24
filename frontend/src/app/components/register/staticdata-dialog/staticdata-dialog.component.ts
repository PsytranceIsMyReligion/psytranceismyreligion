import { StaticData } from "../../../models/member.model";
import { Component, OnInit, Inject } from "@angular/core";
import { MemberService } from "../../../services/member.service";
import { notDuplicateValidator } from "../../../validators/duplicate.staticdata.validator";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import _ from "lodash";
@Component({
  selector: "app-artist-dialog",
  templateUrl: "./staticdata-dialog.component.html",
  styleUrls: ["./staticdata-dialog.component.css"]
})
export class StaticDataDialogComponent implements OnInit {
  staticDataGroup: FormGroup;
  staticData: StaticData;
  type: string;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<StaticDataDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private memberService: MemberService
  ) {}
  ngOnInit() {
    this.staticData = this.data.payload as StaticData;
    this.type = _.capitalize(this.staticData.type);
    if (this.type == "Artist") {
      this.staticDataGroup = this.fb.group({
        name: [
          this.staticData.name,
          [Validators.required, notDuplicateValidator(this.data.toFilter)]
        ],
        origin: [this.staticData.origin, Validators.required],
        facebookUrl: [this.staticData.facebookUrl, Validators.required]
      });
    } else if (this.type == "Festival") {
      this.staticDataGroup = this.fb.group({
        name: [
          this.staticData.name,
          [Validators.required, notDuplicateValidator(this.data.toFilter)]
        ],
        origin: [this.staticData.origin, Validators.required]
      });
    }
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.staticDataGroup.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log(invalid);
  }

  saveStaticData() {
    this.findInvalidControls();
    const staticData: StaticData = {
      name: this.staticDataGroup.get("name").value,
      type: this.data.type,
      origin: this.staticDataGroup.get("origin").value,
      facebookUrl:
        this.data.type == "artist"
          ? this.staticDataGroup.get("facebookUrl").value
          : "",
      createdBy: this.memberService.getUser()
    };
    this.dialogRef.close(staticData);
    console.log(this.data.type, staticData);
  }

  cancel() {
    this.dialogRef.close();
  }
}
