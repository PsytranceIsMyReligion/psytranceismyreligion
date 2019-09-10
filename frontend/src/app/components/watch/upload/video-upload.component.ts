import { Subject } from 'rxjs';
import { MemberService } from './../../../services/member.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Video } from '../../../models/member.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-video-upload',
  templateUrl: './video-upload.component.html',
  styleUrls: ['./video-upload.component.css']
})
export class VideoUploadComponent implements OnInit {

  videoGroup: FormGroup;

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<VideoUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Video, private memberService : MemberService) { }

  ngOnInit() {
    this.videoGroup = this.fb.group({
      title: [this.data ? this.data.title : "", Validators.required],
      description: [this.data ? this.data.description : "", Validators.required],
      value: [this.data ? this.data.value : "", Validators.required],
    });
  }

  saveVideo() {
        let video : Video = {
          title : this.videoGroup.get('title').value,
          description : this.videoGroup.get('description').value,
          value : this.getYoutubeId(this.videoGroup.get('value').value),
          createdBy : this.memberService.getUser(),
        }
        this.dialogRef.close(video);
        console.log('vid', video)
  }

  getYoutubeId(value) {
    value = value.trim();
    return value.substring(value.lastIndexOf("/") + 1, value.length);
  }

  cancel() {
        this.dialogRef.close();
      }
}
