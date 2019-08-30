import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Member } from "../models/member.model";
import { environment } from "../../environments/environment";

const baseUri = environment.baseUri;
@Injectable({
  providedIn: "root"
})
export class MemberService {

  //todo move to config
  countriesUri = "https://restcountries.eu/rest/v2/all";
  
  env : any;

  constructor(private http: HttpClient) {
    this.env = environment;
  }

  getMembers() {
    return this.http.get(`${this.env.baseUri}/members`);
  }

  getMemberById(id) {
    return this.http.get(`${this.env.baseUri}/members/${id}`);
  }

  getMemberBySocialId(id) {
    return this.http.get(`${this.env.baseUri}/members/bysocialid/${id}`);
  }

  createMember(member: Member) {
    return this.http.post(`${this.env.baseUri}/members/add`, member);
  }

  updateMember(id, member) {
    return this.http.post(`${this.env.baseUri}/members/update/${id}`, member);
  }

  deleteMember(id) {
    return this.http.get(`${this.env.baseUri}/members/delete/${id}`);
  }

  landingPageStats() {
    return this.http.get(`${this.env.baseUri}/members/landingpagestats`);
  }

  getAllCountries() {
    return this.http.get(this.countriesUri);
  }

  getAllMusicGenres() {
    return this.http.get(`${this.env.baseUri}/musicgenres`);
  }

  createMusicGenre(genre) {
    return this.http.get(`${this.env.baseUri}/musicgenres/add`, {params : genre});
  }
}
