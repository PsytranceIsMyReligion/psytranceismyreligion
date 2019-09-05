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
      title: ["", Validators.required],
      description: ["", Validators.required],
      value: ["", Validators.required],
    });
  }

  saveVideo() {
        let video : Video = {
          title : this.videoGroup.get('title').value,
          description : this.videoGroup.get('description').value,
          value : this.videoGroup.get('value').value,
          createdBy : this.memberService.getUserId()
        }
        this.dialogRef.close(video);
      }

  cancel() {
        this.dialogRef.close();
      }
}
