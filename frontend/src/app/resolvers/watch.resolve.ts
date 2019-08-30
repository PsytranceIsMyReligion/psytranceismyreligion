import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { VideoService } from '../services/video.service';

@Injectable()
export class WatchResolve implements Resolve<any> {

  constructor(private videoService: VideoService) {}

  resolve(route: ActivatedRouteSnapshot) {
      console.log('getting vids')
      return this.videoService.getAllVideoLinks();
  }
}