import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Member } from "../models/member.model";
import { environment } from "../../environments/environment";

const baseUri = "http://" + environment.baseUri;

@Injectable({
  providedIn: "root"
})
export class MemberService {

  //todo move to config
  countriesUri = "https://restcountries.eu/rest/v2/all";
  member : Member;

  constructor(private http: HttpClient) {
  }

  saveMemberToLocalStorage(_member : Member) {
    sessionStorage.setItem("member", JSON.stringify(_member));
    this.member = _member;
  }

  getUser()  : Member {
    if(this.member)
      return this.member;
  }

  getUserId() : number {
    if(this.member)
      return this.member._id;
  }

  getMembers() {
    return this.http.get(`${baseUri}/members`);
  }

  getMemberById(id) {
    return this.http.get(`${baseUri}/members/${id}`);
  }

  getMemberBySocialId(id) {
    return this.http.get(`${baseUri}/members/bysocialid/${id}`);
  }

  createMember(member: Member) {
    return this.http.post(`${baseUri}/members/add`, member);
  }

  updateMember(id, member) {
    return this.http.post(`${baseUri}/members/update/${id}`, member);
  }

  deleteMember(id) {
    return this.http.get(`${baseUri}/members/delete/${id}`);
  }

  landingPageStats() {
    return this.http.get(`${baseUri}/members/landingpagestats`);
  }

  getAllCountries() {
    return this.http.get(this.countriesUri);
  }

  getAllMusicGenres() {
    return this.http.get(`${baseUri}/musicgenres`);
  }

  createMusicGenre(genre) {
    return this.http.get(`${baseUri}/musicgenres/add`, {params : genre});
  }
}
