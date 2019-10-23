import {from } from "rxjs";
import { MemberService } from "./../../../services/member.service";
import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import { Video } from "../../../models/member.model";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { switchMap, tap, map } from "rxjs/operators";

@Component({
  selector: "app-video-upload",
  templateUrl: "./video-upload.component.html",
  styleUrls: ["./video-upload.component.css"]
})
export class VideoUploadComponent implements OnInit {
  @ViewChild("tagList", { static: false }) tagList;

  videoGroup: FormGroup;
  tagData: [];
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<VideoUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private memberService: MemberService
  ) {}

  ngOnInit() {
    this.tagData = this.data.tags.slice();
    console.log('data', this.data);
    this.videoGroup = this.fb.group({
      title: [this.data.video.title, Validators.required],
      description: [ this.data.video.description, Validators.required
      ],
      value: [this.data.video.value, Validators.required],
      tags: [this.data.video.tags, Validators.required],
      _id: [this.data.video_id]
    });
  }

  ngAfterViewInit() {
    const contains = value => s =>
      s.toLowerCase().indexOf(value.toLowerCase()) !== -1;

    this.tagList.filterChange
      .asObservable()
      .pipe(
        switchMap(value =>
          from([this.data.tags]).pipe(
            tap(value => {
              this.tagList.loading = true;
            }),
            map(data => data.filter(contains(value)))
          )
        )
      )
      .subscribe(x => {
        this.tagData = x;
        this.tagList.loading = false;
      });
  }

  onSelectionChange(event) {
    console.log(event)
  }

  saveVideo() {
    let video: Video = {
      title: this.videoGroup.get("title").value,
      description: this.videoGroup.get("description").value,
      value: this.getYoutubeId(this.videoGroup.get("value").value),
      createdBy: this.memberService.getUser(),
      tags: this.videoGroup.get("tags").value,
      _id: this.data.video._id,
    };
    console.log('closing on',video)
    this.dialogRef.close(video);
  }

  getYoutubeId(value) {
    value = value.trim();
    return value.substring(value.lastIndexOf("/") + 1, value.length);
  }

  cancel() {
    this.dialogRef.close();
  }
}
