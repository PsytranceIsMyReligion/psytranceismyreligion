import { MemberService } from "./../../../../services/member.service";
import { WallPost } from "./../../../../models/member.model";
import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-post-dialog",
  templateUrl: "./post-dialog.component.html",
  styleUrls: ["./post-dialog.component.css"]
})
export class PostDialogComponent implements OnInit {
  postGroup: FormGroup;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: WallPost,
    private memberService: MemberService
  ) {}

  ngOnInit() {
    this.postGroup = this.fb.group({
      title: [this.data ? this.data.title : "", Validators.required],
      content: [this.data ? this.data.content : "", Validators.required]
    });
  }

  editorCreated(editor) {
    // editor.
  }

  editorContentChange(event) {}

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
