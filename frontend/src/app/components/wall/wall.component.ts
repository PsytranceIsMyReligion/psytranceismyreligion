import { MemberService } from "./../../services/member.service";
import { PostDialogComponent } from "./post-dialog/post-dialog.component";
import { WallPost, Member } from "./../../models/member.model";
import { WallService } from "./../../services/wall.service";
import { BehaviorSubject } from "rxjs";
import { Component, OnInit, LOCALE_ID, Input, Inject } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material";

@Component({
  selector: "app-wall",
  templateUrl: "./wall.component.html",
  styleUrls: ["./wall.component.scss"]
})
export class WallComponent implements OnInit {
  @Input("wall$") wall$: BehaviorSubject<any> = new BehaviorSubject({});
  wallData: Array<WallPost> = new Array();
  user: Member;
  constructor(
    private wallService: WallService,
    private memberService: MemberService,
    private toastrService: ToastrService,
    @Inject( LOCALE_ID ) protected localeId: string,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.wall$.subscribe(data => {
      this.wallData = data;
      this.user = this.memberService.getUser();
      console.log('user', this.user)
    });
  }

  setSelectedMember$(member) {
    console.log('selcting', member)
    this.memberService.selectedMember$.next(member);
  }

  deletePost(post) {
    this.wallService.deleteWallPost(post._id).subscribe(res => {
      this.wall$.next([...this.wallData.filter(p => p._id != post._id)]);
      this.toastrService
        .success("Story deleted!", "OK", { timeOut: 2000 })
        .onHidden.subscribe((el: WallPost) => {
          // this.router.navigate(['/nav/watch']);
        });
    })

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
      width: "600px",
      height: "500px",
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
            this.wall$.next([res, ...this.wallData]);
            this.toastrService
              .success("Story created!", "OK", { timeOut: 2000 })
              .onHidden.subscribe((el: WallPost) => {
                // this.router.navigate(['/nav/watch']);
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
            this.toastrService
              .success("Story updated!", "OK", { timeOut: 2000 })
              .onHidden.subscribe(el => {
                // this.router.navigate(['/nav/watch']);
              });
          });
      }
    });
  }
}
