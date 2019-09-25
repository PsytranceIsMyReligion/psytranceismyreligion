import { environment } from "./../../../../../environments/environment";
import { MemberService } from "./../../../../services/member.service";
import { WallPost } from "./../../../../models/member.model";
import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ChangeEvent } from "@ckeditor/ckeditor5-angular";
@Component({
  selector: "app-post-dialog",
  templateUrl: "./post-dialog.component.html",
  styleUrls: ["./post-dialog.component.css"]
})
export class PostDialogComponent implements OnInit {
  postGroup: FormGroup;
  editor = ClassicEditor;
  saveButtonEnabled = true;
  editorConfig = {
    mediaEmbed: {
      previewsInData: false
    },
    simpleUpload: {
      uploadUrl: `${environment.uploadUri}/staticdata/upload`
    }
  };

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: WallPost,
    private memberService: MemberService
  ) {
    console.log(`Upload URL ${environment.uploadUri}`);
  }

  ngOnInit() {
    this.postGroup = this.fb.group({
      title: [this.data ? this.data.title : "", Validators.required],
      content: [this.data ? this.data.content : "", Validators.required]
    });
  }

  public onChange( { editor }: ChangeEvent ) {
    if(editor) {
      const data = editor.getData();
      if(data.indexOf("<img>") > -1) {
        this.saveButtonEnabled = false;
      }
      else
        this.saveButtonEnabled = true;
    }
}

  saveWallPost() {
    let post: WallPost = {
      title: this.postGroup.get("title").value,
      content: this.postGroup.get("content").value,
      createdBy: this.memberService.getUser()
    };
    if (this.data && this.data._id) post._id = this.data._id;
    if (post.content.indexOf("<img") > -1) {
      console.log('timeout')
      setTimeout(() => {
        this.dialogRef.close(post);
      });
    } else {
      this.dialogRef.close(post);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
