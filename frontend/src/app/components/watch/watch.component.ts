import { MemberService } from './../../services/member.service';
import { Video, Member } from './../../models/member.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VideoUploadComponent } from './upload/video-upload.component';
import { VideoService } from '../../services/video.service';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetectorService } from 'ngx-device-detector';



@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.scss']
})
export class WatchComponent implements OnInit {

  videos: Array<Video> = [];
  user: Member;
  height: number = 400;
  width: number = 550;

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    public dialog: MatDialog, private videoService: VideoService,
    private memberService: MemberService, private toastrService: ToastrService,
    private deviceDetectorService :DeviceDetectorService ) {
    if(this.deviceDetectorService.isMobile()) {
      this.height = 200;
      this.width = 250;
    }  
    this.user = this.memberService.getUser();
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      this.videos = data['data'];
    });
  }

  deleteVideo(id) {
    this.videoService.deleteVideoLink(id).subscribe((res) => {
      this.toastrService.success('Video Link deleted', 'OK', {timeOut: 2000}).onHidden.subscribe(res => {
      this.router.navigate(['/nav/watch']);
    });
    });
  }



  openUploadDialog(updateVideo ?: Video): void {
    let data = { title: '', description: '', value: '', _id : '' };
    console.log('open', updateVideo);
    if (updateVideo) {
      data = { title: updateVideo.title, description: updateVideo.description, value: updateVideo.value, _id : updateVideo._id };
    }
    const dialogRef = this.dialog.open(VideoUploadComponent, {
      width: '300px',
      height: '400px',
      data: data
    });

    dialogRef.afterClosed().subscribe((updateVideo: Video) => {
      console.log('The dialog was closed', updateVideo);
      if (!updateVideo) { return; }
      if (!updateVideo._id) {
        console.log('creating')
        this.videoService.createVideoLink(updateVideo).subscribe(res => {
          this.toastrService.success('Video Link created!', 'OK', {timeOut : 2000}).onHidden.subscribe(el => {
          this.router.navigate(['/nav/watch']);
          });
        });
      } 
      else {
        this.videoService.updateVideoLink(updateVideo._id, updateVideo).subscribe(res => {
          this.toastrService.success('Video Link updated!', 'OK', {timeOut : 2000}).onHidden.subscribe(el => {
          this.router.navigate(['/nav/watch']);
          });
        });
      }
    });
  }
}
