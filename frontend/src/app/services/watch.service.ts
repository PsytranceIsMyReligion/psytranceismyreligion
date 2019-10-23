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
export class WatchService {
  env: any;

  constructor(private http: HttpClient) {
    this.env = environment;
  }

  getAllVideoLinks() {
    return this.http.get(`${baseUri}/videos`);
  }

  createVideoLink(video: Video) {
    return this.http.post(`${baseUri}/videos/add`, video);
  }

  updateVideoLink(video: Video) {
    console.log("updating", video);
    return this.http.post(`${baseUri}/videos/update/${video._id}`, video);
  }

  deleteVideoLink(id: string) {
    return this.http.get(`${baseUri}/videos/delete/${id}`);
  }
}
