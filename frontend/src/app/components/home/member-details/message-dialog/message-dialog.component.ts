import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatDialogRef } from "@angular/material/dialog";
import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { environment } from "src/environments/environment";
import { PostDialogComponent } from "../../wall/post-dialog/post-dialog.component";
import { Message, Member } from "src/app/models/member.model";
import { MemberService } from "src/app/services/member.service";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ChangeEvent } from "@ckeditor/ckeditor5-angular";
@Component({
  selector: "app-message-dialog",
  templateUrl: "./message-dialog.component.html",
  styleUrls: ["./message-dialog.component.css"]
})
export class MessageDialogComponent implements OnInit {
  postGroup: FormGroup;
  editor = ClassicEditor;
  saveButtonEnabled = true;
  editorConfig = {
    mediaEmbed: {
      previewsInData: true
    },
    simpleUpload: {
      uploadUrl: `${environment.uploadUri}/staticdata/upload`
    }
  };
  receiver: Member;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Message,
    private memberService: MemberService
  ) {
    console.log(`Upload URL ${environment.uploadUri}`);
  }

  ngOnInit() {
    this.receiver = this.data as Member;
    this.postGroup = this.fb.group({
      title: ["", Validators.required],
      content: ["", Validators.required]
    });
  }

  public onChange({ editor }: ChangeEvent) {
    if (editor) {
      const data = editor.getData();
      if (data.indexOf("<img>") > -1) {
        this.saveButtonEnabled = false;
      } else this.saveButtonEnabled = true;
    }
  }

  saveMessage() {
    let message: Message = {
      title: this.postGroup.get("title").value,
      content: this.postGroup.get("content").value,
      createdBy: this.memberService.getUser(),
      receiver: this.receiver
    };
    if (message.content.indexOf("<img") > -1) {
      console.log("timeout");
      setTimeout(() => {
        this.dialogRef.close(message);
      });
    } else {
      this.dialogRef.close(message);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
