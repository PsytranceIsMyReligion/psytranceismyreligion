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
  user : Member;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, 
    public dialog: MatDialog, private videoService: VideoService, private memberService : MemberService, private matSnackBar: MatSnackBar) {
      this.user = this.memberService.getUser();
  }

  ngOnInit() {
    console.log(this.activatedRoute.data);
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

  openUploadDialog(): void {
    const dialogRef = this.dialog.open(VideoUploadComponent, {
      width: '300px',
      height: '400px',
      data: { title: '', description: '', value: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.videoService.createVideoLink(result).subscribe(res => {
        this.matSnackBar.open("Video Link saved!", "OK");
        this.router.navigate(["/nav/watch"]);
      });
    });
  }


}
