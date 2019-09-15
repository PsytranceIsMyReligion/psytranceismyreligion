import { WallPost } from "./../models/member.model";
import { environment } from "./../../environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
const baseUri = "http://" + environment.baseUri;

@Injectable({
  providedIn: "root"
})
export class WallService {
  env = environment;

  constructor(private http: HttpClient) {}

  getWallPosts() {
    return this.http.get(`${baseUri}/wallposts`);
  }

  createWallPost(post) {
    return this.http.post(`${baseUri}/wallposts/add`, post);
  }

  updateWallPost(id: string, post: WallPost) {
    return this.http.post(`${baseUri}/wallposts/update/${id}`, post);
  }

  deleteWallPost(id: string) {
    return this.http.get(`${baseUri}/wallposts/delete/${id}`);
  }
}
