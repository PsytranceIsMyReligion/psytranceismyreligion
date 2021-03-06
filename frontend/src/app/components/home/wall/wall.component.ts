import { MatDialog } from "@angular/material/dialog";
import { Angulartics2 } from "angulartics2";
import { DeviceDetectorService } from "ngx-device-detector";
import { environment } from "./../../../../environments/environment.prod";
import { MemberService } from "./../../../services/member.service";
import { PostDialogComponent } from "./post-dialog/post-dialog.component";
import { WallPost, Member } from "./../../../models/member.model";
import { WallService } from "./../../../services/wall.service";
import { BehaviorSubject } from "rxjs";
import {
  Component,
  OnInit,
  LOCALE_ID,
  Input,
  Inject,
  ViewChild,
  TemplateRef,
  ViewChildren,
  QueryList,
  ElementRef
} from "@angular/core";
import { ToastrService } from "ngx-toastr";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { findIndex } from "lodash";

const IFRAME_SRC = "//cdn.iframe.ly/api/iframe";
const API_KEY = "f1a837d9d5c21c46096ba2";
@Component({
  selector: "app-wall",
  templateUrl: "./wall.component.html",
  styleUrls: ["./wall.component.scss"]
})
export class WallComponent implements OnInit {
  @Input("wall$") wall$: BehaviorSubject<any> = new BehaviorSubject({});
  @Input("paginationConfig$") paginationConfig$: BehaviorSubject<
    any
  > = new BehaviorSubject({});
  wallData: Array<WallPost> = new Array();
  user: Member;
  editor = ClassicEditor;
  env = environment;
  isMobile = false;
  editorData = "";
  editorConfig = {
    mediaEmbed: {
      previewsInData: true
    },
    simpleUpload: {
      uploadUrl: `${environment.uploadUri}/staticdata/upload`
    },
    // plugins: [Emoji],
    toolbar: ["undo", "redo", "bold", "italic"]
  };

  constructor(
    private wallService: WallService,
    private memberService: MemberService,
    private toastrService: ToastrService,
    private deviceDetectorService: DeviceDetectorService,
    @Inject(LOCALE_ID) protected localeId: string,
    public dialog: MatDialog,
    private angulartics2: Angulartics2
  ) {
    this.isMobile = this.deviceDetectorService.isMobile();
  }

  ngOnInit() {
    this.wall$.subscribe(data => {
      this.wallData = data;
      console.log("wallData", data);
      this.user = this.memberService.getUser();
    });
    this.paginationConfig$.subscribe(data => {
      console.log("config", data);
    });
  }

  setSelectedMember$(member) {
    this.memberService.selectedMember$.next(member);
  }

  deletePost(post) {
    this.wallService.deleteWallPost(post._id).subscribe(res => {
      this.wall$.next([...this.wallData.filter(p => p._id != post._id)]);
      this.toastrService
        .success("Story deleted!", "OK", { timeOut: 2000 })
        .onHidden.subscribe((el: WallPost) => {});
    });
  }

  openPostDialog(updatePost?: WallPost): void {
    let data = { title: "", content: "", _id: "", comments: [], likes: [] };
    if (updatePost) {
      data = {
        title: updatePost.title,
        content: updatePost.content,
        _id: updatePost._id,
        comments: updatePost.comments,
        likes: updatePost.likes
      };
    }
    const dialogRef = this.dialog.open(PostDialogComponent, {
      width: this.isMobile ? "600px" : "700px",
      height: this.isMobile ? "600px" : "700px",
      data: data
    });

    dialogRef.afterClosed().subscribe((updatePostResponse: WallPost) => {
      if (!updatePostResponse) {
        return;
      }
      if (!updatePostResponse._id) {
        console.log("creating", updatePostResponse);
        this.wallService
          .createWallPost(updatePostResponse)
          .subscribe((res: WallPost) => {
            console.log("post", res);
            this.wall$.next([res, ...this.wallData]);
            this.toastrService.success("Story created!", "OK", {
              timeOut: 2000
            });
            this.angulartics2.eventTrack.next({
              action: "NewWallPostAction",
              properties: { author: updatePostResponse.createdBy.uname }
            });
          });
      } else {
        updatePostResponse.comments = updatePost.comments;
        updatePostResponse.likes = updatePost.likes;
        console.log("updating", updatePostResponse);
        this.wallService
          .updateWallPost(updatePostResponse._id, updatePostResponse)
          .subscribe((res: WallPost) => {
            console.log("update res", res);
            this.wallData = [
              res,
              ...this.wallData.filter(p => p._id != res._id)
            ];
            this.wall$.next([...this.wallData]);
            this.toastrService.success("Story updated!", "OK", {
              timeOut: 2000
            });
          });
      }
    });
  }

  likeUnlikePost(post, likeFlag) {
    console.log("like", post, likeFlag);
    if (likeFlag) {
      post.likes.push(this.user._id);
    } else {
      let idx = findIndex(post.likes, this.user._id);
      post.likes.splice(idx, 1);
    }
    this.wallService
      .updateWallPost(post._id, post)
      .subscribe((res: WallPost) => {
        console.log("res", res);
        this.wallData = [res, ...this.wallData.filter(p => p._id != res._id)];
        this.wall$.next([...this.wallData]);
      });
    console.log(post);
  }

  public saveComment(post) {
    let comment = {
      title: "Comment",
      content: this.editorData,
      createdBy: this.user._id
    };
    post.comments.push(comment);
    this.wallService
      .updateWallPost(post._id, post)
      .subscribe((res: WallPost) => {
        this.wallData = [res, ...this.wallData.filter(p => p._id != res._id)];
        this.wall$.next([...this.wallData]);
      });
    this.editorData = "";
  }

  updateComment(updateCommentId, post) {
    let comment = post.comments.filter(c => c._id == updateCommentId)[0];
    comment.content = this.editorData;
    post.comments.filter(c => c._id != updateCommentId).push(comment);
    console.log("update", post.comments, updateCommentId);
    this.wallService
      .updateWallPost(post._id, post)
      .subscribe((res: WallPost) => {
        this.wallData = [res, ...this.wallData.filter(p => p._id != res._id)];
        this.wall$.next([...this.wallData]);
      });
    this.editorData = "";
  }

  deleteComment(deleteCommentId, post) {
    console.log("delete", deleteCommentId, post);
    post.comments = post.comments.filter(c => c._id != deleteCommentId);
    this.wallService
      .updateWallPost(post._id, post)
      .subscribe((res: WallPost) => {
        this.wallData = [res, ...this.wallData.filter(p => p._id != res._id)];
        this.wall$.next([...this.wallData]);
      });
  }

  userLikesPost(likes) {
    let idx = findIndex(likes, o => {
      return o._id == this.user._id;
    });
    return idx >= 0;
  }

  onScroll() {
    let config = this.paginationConfig$.getValue();
    config.page = config.nextPage;
    if (config.page <= config.totalPages && config.hasNextPage) {
      console.log("scroll", config);
      this.wallService.getWallPosts(config).subscribe(res => {
        this.wallData = this.wallData.concat(res["docs"]);
        delete res["docs"];
        console.log("returned config", res);
        this.paginationConfig$.next(res);
        this.wall$.next(this.wallData);
      });
    } else {
      console.log("end");
    }
  }
}
