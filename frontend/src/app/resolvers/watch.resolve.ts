import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { WatchService } from '../services/watch.service';
import { forkJoin } from 'rxjs';

@Injectable()
export class WatchResolve implements Resolve<any> {

  constructor(private watchService: WatchService) {}

  resolve(route: ActivatedRouteSnapshot) {
      return  this.watchService.getAllVideoLinks();
  }
}
