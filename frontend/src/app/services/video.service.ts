import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Video } from "../models/member.model";
import { environment } from "../../environments/environment";

const baseUri = environment.baseUri;
@Injectable({
  providedIn: "root"
})
export class VideoService {

  env : any;

  constructor(private http: HttpClient) {
    this.env = environment;
  }
 
  getAllVideoLinks() {
    return this.http.get(`${this.env.baseUri}/videos`);
  }
  
  
  createVideoLink(video: Video) {
    return this.http.post(`${this.env.baseUri}/videos/add`, video);
  }

  
  updateVideo(id : string, video : Video) {
    return this.http.post(`${this.env.baseUri}/videos/update/${id}`, video);
  }

  deleteVideoLink(id : string) {
    return this.http.get(`${this.env.baseUri}/videos/delete/${id}`);
  }
}