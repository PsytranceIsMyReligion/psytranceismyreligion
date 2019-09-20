import { StaticData } from "../../../models/member.model";
import { Component, OnInit, Inject } from "@angular/core";
import { MemberService } from "../../../services/member.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-artist-dialog",
  templateUrl: "./staticdata-dialog.component.html",
  styleUrls: ["./staticdata-dialog.component.css"]
})
export class StaticDataDialogComponent implements OnInit {
  staticDataGroup: FormGroup;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<StaticDataDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StaticData,
    private memberService: MemberService
  ) {}

  ngOnInit() {
    console.log(this.data);
    if (this.data.type == "artist") {
      this.staticDataGroup = this.fb.group({
        name: [this.data ? this.data.name : "", Validators.required],
        origin: [this.data ? this.data.origin : "", Validators.required],
        facebookUrl: [this.data ? this.data.facebookUrl : "", Validators.required]
      });
    } else {
      this.staticDataGroup = this.fb.group({
        name: [this.data ? this.data.name : "", Validators.required],
        origin: [this.data ? this.data.origin : "", Validators.required]
      });
    }
  }

  saveStaticData() {
    const staticData: StaticData = {
      name: this.staticDataGroup.get("name").value,
      type: this.data.type,
      origin: this.staticDataGroup.get("origin").value,
      facebookUrl: this.data.type == "artist" ? this.staticDataGroup.get("facebookUrl").value : "",
      createdBy: this.memberService.getUser()
    };
    this.dialogRef.close(staticData);
    console.log(this.data.type, staticData);
  }

  cancel() {
    this.dialogRef.close();
  }
}
