import { Socket } from "ngx-socket-io";
import { Injectable, OnInit } from "@angular/core";
import { Observable, BehaviorSubject, pipe } from "rxjs";
import { map, tap, switchMap, shareReplay, first } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Member } from "../models/member.model";
import { environment } from "../../environments/environment";
import countries from "../../assets/static-data/countries.json";
import dropdowns from "../../assets/static-data/dropdowns.json";

const baseUri = environment.baseUri;
const toBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
    // "Access-Control-Allow-Credentials": "true"
  })
};
@Injectable({
  providedIn: "root"
})
export class MemberService implements OnInit {
  user: Member;
  user$: BehaviorSubject<Member> = new BehaviorSubject({});
  public avatarUrl$: BehaviorSubject<string> = new BehaviorSubject("");
  selectedMember$: BehaviorSubject<Member> = new BehaviorSubject({});
  loggedOnUsers$: BehaviorSubject<Member>;
  countries = countries;
  dropdowns = dropdowns;
  members$: BehaviorSubject<Array<Member>>;
  loggedOnMembers$: BehaviorSubject<Array<Member>> = new BehaviorSubject([]);
  constructor(private http: HttpClient, private socket: Socket) {

  }

  ngOnInit() {
    this.loadMembers();

  }

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
    console.log('id',  this.members$.getValue().filter(m => m._id == id))
    return this.members$.getValue().filter(m => m._id == id)[0];
  }

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
  loadMembers() {
    return this.http.get(`${baseUri}/members`, httpOptions).pipe(
      map((members: Array<Member>) => {
        return members.map(member => {
          return this.enrichMember(member);
        });
      }),
      tap(members => {
        console.log("loading", members);
        this.members$ = new BehaviorSubject(members as Array<Member>);
      }),
      first(
      ),
      tap(() => {console.log('initi users');this.initLoggedOnUsers()}),
      shareReplay()
    );

  }

  initLoggedOnUsers() {
    console.log("initing user listing")
    this.socket.on("logged-on-users", (users: Array<String>) => {
      let user = users.filter(el => el).map(el => this.getMemberById(el));
      console.log("logged-on-users", user);
      this.loggedOnMembers$.next(user);
    });
    this.socket.emit("get-logged-on-users", this.user$.getValue());
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
    return this.http.get(`${baseUri}/members/landingpagestats`, httpOptions);
  }

  getAllCountries() {
    return countries;
  }

  getDropdownDisplay(dataset, value) {
    return dropdowns[dataset].filter(el => el.id === value)[0]["value"];
  }

  getStaticData() {
    return this.http.get(`${baseUri}/staticdata`, httpOptions);
  }

  addStaticData(value) {
    return this.http.post(`${baseUri}/staticdata/add`, { params: value });
  }
}
