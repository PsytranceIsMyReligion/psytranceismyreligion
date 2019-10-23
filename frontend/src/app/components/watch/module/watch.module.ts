import { WatchService } from './../../../services/watch.service';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WatchRoutingModule } from "./watch-routing.module";
import { WatchComponent } from "../watch.component";
import { SharedModule } from "../../../modules/shared.module";
import { NgxYoutubePlayerModule } from "ngx-youtube-player";
import { VideoUploadComponent } from "../upload/video-upload.component";
@NgModule({
  entryComponents: [VideoUploadComponent],
  declarations: [WatchComponent, VideoUploadComponent],
  imports: [CommonModule, WatchRoutingModule, SharedModule, NgxYoutubePlayerModule.forRoot()],
  providers: [WatchService]
})
export class WatchModule {}
