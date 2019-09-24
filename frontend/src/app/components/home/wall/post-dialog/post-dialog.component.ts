import { environment } from "./../../../../../environments/environment.local";
import { MemberService } from "./../../../../services/member.service";
import { WallPost } from "./../../../../models/member.model";
import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
@Component({
  selector: "app-post-dialog",
  templateUrl: "./post-dialog.component.html",
  styleUrls: ["./post-dialog.component.css"]
})
export class PostDialogComponent implements OnInit {
  postGroup: FormGroup;
  editor = ClassicEditor;
  editorConfig = {
    mediaEmbed: {
      previewsInData: true
    },
    simpleUpload: {
      uploadUrl: `${environment.baseUri}/staticdata/upload`
    }
  };

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: WallPost,
    private memberService: MemberService
  ) {
    console.log(`base uri ${environment.baseUri}`);
  }

  ngOnInit() {
    this.postGroup = this.fb.group({
      title: [this.data ? this.data.title : "", Validators.required],
      content: [this.data ? this.data.content : "", Validators.required]
    });
  }

  saveWallPost() {
    let post: WallPost = {
      title: this.postGroup.get("title").value,
      content: this.postGroup.get("content").value,
      createdBy: this.memberService.getUser()
    };
    if (this.data && this.data._id) post._id = this.data._id;
    this.dialogRef.close(post);
  }

  cancel() {
    this.dialogRef.close();
  }
}
