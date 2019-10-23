import { MemberService } from "./../../services/member.service";
import { Video, Member } from "./../../models/member.model";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit, Inject, LOCALE_ID } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { VideoUploadComponent } from "./upload/video-upload.component";
import { WatchService } from "../../services/watch.service";
import { ToastrService } from "ngx-toastr";
import { DeviceDetectorService } from "ngx-device-detector";
import { dedup } from "lodash";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-watch",
  templateUrl: "./watch.component.html",
  styleUrls: ["./watch.component.scss"]
})
export class WatchComponent implements OnInit {
  videos$: BehaviorSubject<Array<Video>>;
  user: Member;
  height: number = 400;
  width: number = 560;
  tagFilter: any = { tags: ''};
  tags;
  isMobile = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private watchService: WatchService,
    private memberService: MemberService,
    private toastrService: ToastrService,
    @Inject(LOCALE_ID) protected localeId: string,
    private deviceDetectorService: DeviceDetectorService
  ) {
    if (this.deviceDetectorService.isMobile()) {
      this.height = 200;
      this.width = 250;
      this.isMobile = true;
    }
    this.user = this.memberService.getUser();
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      this.videos$ = new BehaviorSubject(data["videos"]);
      this.videos$.subscribe((vids) => {
        let allTags = this.videos$
        .getValue()
        .filter(el => el.tags)
        .map(el => el.tags)
        .reduce((prev, next) => {
          return prev.concat(next);
        });
        this.tags = Array.from(new Set(allTags));
      })
      console.log('tags', this.videos$.getValue().filter(el => el.tags));
    });
  }

  navigateToMember(id) {
    this.router.navigate(['home/' + id], { relativeTo : this.activatedRoute.parent })
  }
  deleteVideo(id) {
    this.watchService.deleteVideoLink(id).subscribe(res => {
      this.toastrService
        .success("Video Link deleted", "OK", { timeOut: 2000 })
        .onHidden.subscribe(res => {
          this.router.navigate(["/nav/watch"]);
        });
    });
  }

  openUploadDialog(updateVideo?: Video): void {
    let emptyVideo : Video = { title: "", description: "", value: "", createdBy : {}, tags: [] };
    console.log("open", this.tags);
    // if (updateVideo) {
    //   video = {
    //     title: updateVideo.title,
    //     description: updateVideo.description,
    //     value: updateVideo.value,
    //     _id: updateVideo._id,
    //     createdBy: updateVideo.createdBy,
    //     tags: updateVideo.tags
    //   };
    // }
    // else updateVideo = videov;
    const dialogRef = this.dialog.open(VideoUploadComponent, {
      width: "400px",
      height: "500px",
      data: { video: updateVideo ? updateVideo : emptyVideo, tags: this.tags }
    });

    dialogRef.afterClosed().subscribe((updateVideo: Video) => {
      if (!updateVideo) return;
      if (updateVideo._id == "") {
        console.log("creating", updateVideo);
        this.watchService.createVideoLink(updateVideo).subscribe((res: any) => {
          this.videos$.next([
            updateVideo,
            ...this.videos$.getValue().filter(el => el._id != updateVideo._id)
          ]);
          this.toastrService.success("Video Link created!", "OK", {
            timeOut: 2000
          });
        });
      } else {
        console.log("updating", updateVideo);
        this.watchService
          .updateVideoLink(updateVideo)
          .subscribe((res: any) => {
            this.videos$.next([
              updateVideo,
              ...this.videos$.getValue().filter(el => el._id != updateVideo._id)
            ]);
            this.toastrService.success("Video Link updated!", "OK", {
              timeOut: 2000
            });
          });
      }
    });
  }
}
