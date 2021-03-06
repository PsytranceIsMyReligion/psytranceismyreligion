import { environment } from "./../../../../environments/environment";
import { Avatar } from "./../../../models/member.model";
import { Component, OnInit, Inject } from "@angular/core";
import { MemberService } from "./../../../services/member.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FileRestrictions, SuccessEvent } from "@progress/kendo-angular-upload";
import { FileInfo } from "@progress/kendo-angular-upload";
import { UploadEvent, RemoveEvent } from '@progress/kendo-angular-upload';

@Component({
  selector: "app-avatar-dialog",
  templateUrl: "./avatar-dialog.component.html",
  styleUrls: ["./avatar-dialog.component.css"]
})
export class AvatarDialogComponent implements OnInit {
  public avatars: Array<FileInfo>;
  avatarGroup: FormGroup;
  public submitted = false;
  uploadSaveUrl = `${environment.baseUri}/members/add/avatar`;
  public fileRestrictions: FileRestrictions = {
    allowedExtensions: ["jpg", "jpeg", "png"],
    // minFileSize: 1048576,
    maxFileSize: 1048576  // 1MB
  };

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AvatarDialogComponent>,
    private memberService: MemberService,
    @Inject(MAT_DIALOG_DATA) public data: Avatar
  ) {}

  ngOnInit() {
    this.avatarGroup = this.fb.group({
      avatars: [this.avatars, Validators.required]
    });
  }

  uploadEventHandler(event : UploadEvent) {
    event.data = {
      id : this.memberService.getUserId()
    }
    console.log('event', event)
    // setTimeout(() => this.dialogRef.close(event.files), 1000);
  }

  successEventHandler(e: SuccessEvent) {
    console.log('The ' + e.operation + ' was successful!');
    this.dialogRef.close(e.files);
  }

  errorEventHandler(e: ErrorEvent) {
    console.log('An error occurred');
  }

  cancel() {
    this.dialogRef.close();
  }
}
