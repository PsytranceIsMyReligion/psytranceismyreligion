import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, pipe } from "rxjs";
import { map, tap, switchMap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Member } from "../models/member.model";
import { environment } from "../../environments/environment";
import countries from "../../assets/static-data/countries.json";
import dropdowns from "../../assets/static-data/dropdowns.json";

const baseUri = environment.baseUri;
const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});
@Injectable({
  providedIn: "root"
})
export class MemberService {
  user: Member;
  user$: BehaviorSubject<Member> =  new BehaviorSubject({});
  avatarUrl$: BehaviorSubject<string> = new BehaviorSubject("");
  selectedMember$: BehaviorSubject<Member> = new BehaviorSubject({});
  countries = countries;
  dropdowns = dropdowns;
  members;
  constructor(private http: HttpClient) {}

  async saveMemberToLocalStorage(_member: Member) {
    _member.originDisplay = this.getCountryName(_member.origin);
    _member.locationDisplay = this.getCountryName(_member.location);
    sessionStorage.setItem(
      "member",
      JSON.stringify(this.enrichMember(_member))
    );
    this.avatarUrl$.next(_member.avatarUrl);
    this.user$.next(_member);
    this.selectedMember$.next(_member);
    this.user = _member;
  }

  getUser(): Member {
    if (this.user) {
      return this.user;
    }
  }

  getUser$(): BehaviorSubject<Member> {
    return this.user$;
  }

  
  getUserId(): string {
    if (this.user) {
      return this.user._id;
    }
  }

  getMemberById(id) {
    console.log("m", this.members.filter(m => m._id == id)[0]);
    return this.members.filter(m => m._id == id)[0];
  }

  // getRegistrationFormStaticData() {

  // }

  getCountryName(code) {
    return this.countries.filter(country => country["alpha3Code"] == code)[0][
      "name"
    ];
  }

  setSelectedMember$(member) {
    this.selectedMember$.next(member);
  }
  getSelectedMember$() {
    return this.selectedMember$;
  }
  getMembers() {
    return this.http.get(`${baseUri}/members`).pipe(
      tap(members => (this.members = members)),
      map((members: Array<Member>) => {
        return members.map(member => {
          return this.enrichMember(member);
        });
      })
    );
  }

  private enrichMember(member: Member) {
    member.originDisplay = this.getCountryName(member.origin);
    member.locationDisplay = this.getCountryName(member.location);
    member.festivalfrequencyDisplay = this.getDropdownDisplay(
      "festivalfrequency",
      member.festivalfrequency
    );
    member.partyfrequencyDisplay = this.getDropdownDisplay(
      "partyfrequency",
      member.partyfrequency
    );
    member.membertypeDisplay = this.getDropdownDisplay(
      "membertype",
      member.membertype
    );
    return member;
  }

  // getMemberById(id) {
  //   return this.http.get(`${baseUri}/members/${id}`);
  // }

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

  // createAvatar(avatar) {
  //   return this.http.post(`${baseUri}/members/add/avatar`, avatar);
  // }

  updateAvatar(avatar) {
    return this.http.post(`${baseUri}/members/add/avatar${avatar._id}`, avatar);
  }

  landingPageStats() {
    return this.http.get(`${baseUri}/members/landingpagestats`);
  }

  getAllCountries() {
    return countries;
  }

  getDropdownDisplay(dataset, value) {
    return dropdowns[dataset].filter(el => el.id === value)[0]["value"];
  }

  getStaticData() {
    return this.http.get(`${baseUri}/static`);
  }

  // createMusicGenre(genre) {
  //   return this.http.get(`${baseUri}/staticdata/add`, { params: genre });
  // }

  addStaticData(value) {
    return this.http.post(`${baseUri}/static/add`, { params: value });
  }
}
