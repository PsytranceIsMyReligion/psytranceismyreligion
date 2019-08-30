import { Video } from './../../models/member.model';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.scss']
})
export class WatchComponent implements OnInit {

  videos : Array<Video> = []; 

  constructor(private activatedRoute : ActivatedRoute) { 
    this.videos = this.activatedRoute.snapshot.data["data"];
  }

  ngOnInit() {
  }

}
