import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, pipe } from "rxjs";
import { map, tap, switchMap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Member } from "../models/member.model";
import { environment } from "../../environments/environment";
import countries from "../../assets/static-data/countries.json";
const baseUri = "http://" + environment.baseUri;

@Injectable({
  providedIn: "root"
})
export class MemberService {

  user: Member;
  user$: BehaviorSubject<Member>;
  selectedMember$: BehaviorSubject<Member>;
  countries = [];

  constructor(private http: HttpClient) {
    this.countries = countries;
  }

  saveMemberToLocalStorage(_member: Member) {
    _member.originDisplay = this.getCountryName(_member.origin);
    _member.locationDisplay = this.getCountryName(_member.location);
    sessionStorage.setItem("member", JSON.stringify(_member));
    this.user$ = new BehaviorSubject(_member);
    this.selectedMember$ = new BehaviorSubject(_member);
    this.user = _member;
  }

  getUser(): Member {
    if (this.user)
      return this.user;
  }

  getUser$(): BehaviorSubject<Member> {
    return this.user$;
  }

  getUserId(): number {
    if (this.user)
      return this.user._id;
  }


  // getRegistrationFormStaticData() {

  // }

  getCountryName(code) {
    return this.countries.filter(country => country['alpha3Code'] == code)[0]['name'];
  }

  setSelectedMember$(member) {
    this.selectedMember$.next(member);
  }
  getSelectedMember$() {
    return this.selectedMember$;
  }
  getMembers() {
    return this.http.get(`${baseUri}/members`).pipe(map((members: Array<Member>) => {
      return members.map(member => {
        member.originDisplay = this.getCountryName(member.origin);
        member.locationDisplay = this.getCountryName(member.location);
        return member;
      })
    }));
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
    return countries;
  }

  getStaticData() {
    return this.http.get(`${baseUri}/static`);
  }

  // createMusicGenre(genre) {
  //   return this.http.get(`${baseUri}/staticdata/add`, { params: genre });
  // }

  addStaticData(value) {
    return this.http.post(`${baseUri}/static/add`, { params : value })
  }
}
