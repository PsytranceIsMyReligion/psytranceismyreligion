import { MemberService } from './../../services/member.service';
import { Video, Member } from './../../models/member.model';
import { ActivatedRoute, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { VideoUploadComponent } from './upload/video-upload.component';
import { VideoService } from '../../services/video.service';
import { MatSnackBar } from '@angular/material';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.scss']
})
export class WatchComponent implements OnInit {

  videos: Array<Video> = [];
  user: Member;

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    public dialog: MatDialog, private videoService: VideoService, private memberService: MemberService, private matSnackBar: MatSnackBar) {
    this.user = this.memberService.getUser();
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      this.videos = data['data'];
    })
  }

  deleteVideo(id) {
    this.videoService.deleteVideoLink(id).subscribe((res) => {
      this.matSnackBar.open("Video Link deleted!", "OK");
      this.router.navigate(["/nav/watch"]);
    })
  }



  openUploadDialog(updateVideo ?: Video): void {
    let data = { title: '', description: '', value: '' };
    console.log('open', updateVideo);
    if (updateVideo) {
      data = { title: updateVideo.title, description: updateVideo.description, value: updateVideo.value }
    }
    const dialogRef = this.dialog.open(VideoUploadComponent, {
      width: '300px',
      height: '400px',
      data: data
    });

    dialogRef.afterClosed().subscribe((updateVideo: Video) => {
      console.log('The dialog was closed', updateVideo);
      if (!updateVideo) {
        this.videoService.createVideoLink(updateVideo).subscribe(res => {
          this.matSnackBar.open("Video Link saved!", "OK");
          this.router.navigate(["/nav/watch"]);
        });
      } else {
        this.videoService.updateVideoLink(updateVideo._id, updateVideo).subscribe(res => {
          this.matSnackBar.open("Video Link updated!", "OK");
          this.router.navigate(["/nav/watch"]);
        });
      }
    });
  }


}
