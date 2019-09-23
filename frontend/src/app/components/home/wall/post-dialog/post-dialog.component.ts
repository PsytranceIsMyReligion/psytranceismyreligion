import { MemberService } from "./../../../../services/member.service";
import { WallPost } from "./../../../../models/member.model";
import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
// import { ImageUpload } from "quill-image-upload";
import { environment } from "src/environments/environment";
import * as QuillStatic from "quill";

import imageUpload from "quill-plugin-image-upload";

const imageUploadDef = () => {
  console.log("imageUploadDef");
  let fileInput: any = document.querySelector("input.ql-image[type=file]");
  if (fileInput == null) {
    fileInput = document.createElement("input");
    fileInput.setAttribute("type", "file");
    fileInput.setAttribute(
      "accept",
      "image/png, image/gif, image/jpeg, image/bmp, image/x-icon"
    );
    fileInput.classList.add("ql-image");
    fileInput.addEventListener("change", () => {
      if (fileInput.files != null && fileInput.files[0] != null) {
        let reader = new FileReader();
        reader.onload = e => {
          let range = this.quill.getSelection(true);
          this.quill.updateContents(
            new QuillStatic.Delta()
              .retain(range.index)
              .delete(range.length)
              .insert({ image: e.target["result"] }),
            QuillStatic.Emitter.sources.USER
          );
          fileInput.value = "";
        };
        reader.readAsDataURL(fileInput.files[0]);
      }
    });
    this.container.appendChild(fileInput);
  }
  fileInput.click();
};

const imageUploadDef2 = () => file => {
  console.log("uploading2", file);
  // return a Promise that resolves in a link to the uploaded image
  return new Promise((resolve, reject) => {
    fetch(`${environment.baseUri}/upload`, {
      method: "get"
    })
      .then(response => response.json())
      .then(jsonData => {
        console.log("res", jsonData);
        resolve(jsonData.imageUrl);
      })
      .catch(err => {
        //error block
      });
  });
};

@Component({
  selector: "app-post-dialog",
  templateUrl: "./post-dialog.component.html",
  styleUrls: ["./post-dialog.component.css"]
})
export class PostDialogComponent implements OnInit {
  postGroup: FormGroup;
  // quillToolbarOptions = {
  //   toolbar: { image: this.imageUploadDef }
  // };
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: WallPost,
    private memberService: MemberService
  ) {
    QuillStatic.register({ "modules/imageUpload": imageUpload }); 
  }

  ngOnInit() {
    this.postGroup = this.fb.group({
      title: [this.data ? this.data.title : "", Validators.required],
      content: [this.data ? this.data.content : "", Validators.required]
    });
  }

  configEditor(editorInstance) {
    let toolbar = editorInstance.getModule("toolbar");
    // toolbar.addHandler("imageUpload", this.uploadHandler);
    // let Quill = QuillStatic;
    // Quill.register({ image: imageUploadDef });
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

  // imageHandler() {
  //   const Imageinput = document.createElement('input');
  //   Imageinput.setAttribute('type', 'file');
  //   Imageinput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
  //   Imageinput.classList.add('ql-image');
  
  //   Imageinput.addEventListener('change', () =>  {
  //     const file = Imageinput.files[0];
  //     if (Imageinput.files != null && Imageinput.files[0] != null) {
  //         this._service.sendFileToServer(file).subscribe(res => {
  //         this._returnedURL = res;
  //         this.pushImageToEditor();
  //         });
  //     }
  // });
  
  //   Imageinput.click();
  // }

  uploadHandler = () => {
    upload: file => {
    return new Promise((resolve, reject) => {
      const fd = new FormData();
      fd.append("files", file);
      console.log("uploading file", file);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${environment.baseUri}/staticdata/upload`, true);
      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve(response.file_path); // Must resolve as a link to the image
        }
      };
      xhr.send(fd);
    });
    };
  };
}
