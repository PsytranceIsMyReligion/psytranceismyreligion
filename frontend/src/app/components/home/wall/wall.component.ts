import { environment } from './../../../../environments/environment.prod';
import { MemberService } from "./../../../services/member.service";
import { PostDialogComponent } from "./post-dialog/post-dialog.component";
import { WallPost, Member } from "./../../../models/member.model";
import { WallService } from "./../../../services/wall.service";
import { BehaviorSubject } from "rxjs";
import { Component, OnInit, LOCALE_ID, Input, Inject } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
const IFRAME_SRC = "//cdn.iframe.ly/api/iframe";
const API_KEY = "f1a837d9d5c21c46096ba2";
@Component({
  selector: "app-wall",
  templateUrl: "./wall.component.html",
  styleUrls: ["./wall.component.scss"]
})
export class WallComponent implements OnInit {
  @Input("wall$") wall$: BehaviorSubject<any> = new BehaviorSubject({});
  wallData: Array<WallPost> = new Array();
  user: Member;
  editor = ClassicEditor;
  env = environment;
  editorConfig = {
    readOnly: true,
    toolbar: [],
    simpleUpload : {
      uploadUrl: `${this.env.baseUri}/staticdata/upload`
    },
    mediaEmbed: {
      providers: [
        {
          name: "iframely previews",
          url: /.+/,
          html: match => {
            const url = match[0];
            var iframeUrl =
              IFRAME_SRC +
              "?app=1&api_key=" +
              API_KEY +
              "&url=" +
              encodeURIComponent(url);
            return (
              // If you need, set maxwidth and other styles for 'iframely-embed' class - it's yours to customize
              '<div class="iframely-embed">' +
              '<div class="iframely-responsive">' +
              `<iframe src="${iframeUrl}" ` +
              'frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>' +
              "</iframe>" +
              "</div>" +
              "</div>"
            );
          }
        }
      ]
    }
  };

  constructor(
    private wallService: WallService,
    private memberService: MemberService,
    private toastrService: ToastrService,
    @Inject(LOCALE_ID) protected localeId: string,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.wall$.subscribe(data => {
      this.wallData = data;
      this.user = this.memberService.getUser();
    });
  }

  // ngOnAfterViewInit() {
  //   document.querySelectorAll('oembed[url]').forEach(element: => {
  //     iframely.load(element, element.attributes.url.value);
  //   });
  // }

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
    let data = { title: "", content: "", _id: "" };
    if (updatePost) {
      data = {
        title: updatePost.title,
        content: updatePost.content,
        _id: updatePost._id
      };
    }
    const dialogRef = this.dialog.open(PostDialogComponent, {
      width: "700px",
      height: "600px",
      data: data
    });

    dialogRef.afterClosed().subscribe((updatePost: WallPost) => {
      if (!updatePost) {
        return;
      }
      if (!updatePost._id) {
        console.log("creating");
        this.wallService
          .createWallPost(updatePost)
          .subscribe((res: WallPost) => {
            console.log("post", res);
            this.wall$.next([res, ...this.wallData]);
            this.toastrService.success("Story created!", "OK", {
              timeOut: 2000
            });
          });
      } else {
        console.log(updatePost);
        this.wallService
          .updateWallPost(updatePost._id, updatePost)
          .subscribe((res: WallPost) => {
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
}
