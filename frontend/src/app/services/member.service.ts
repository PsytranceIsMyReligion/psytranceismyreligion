import moment from "moment";
import { Socket } from "ngx-socket-io";
import { Injectable, OnInit } from "@angular/core";
import {
  Observable,
  BehaviorSubject,
  pipe,
  of,
  from,
  empty,
  Subject
} from "rxjs";
import {
  map,
  tap,
  switchMap,
  shareReplay,
  first,
  publishReplay,
  refCount
} from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Member, Message, StaticData } from "../models/member.model";
import { environment } from "../../environments/environment";
import countries from "../../assets/static-data/countries.json";
import dropdowns from "../../assets/static-data/dropdowns.json";
import { Cacheable, CacheBuster } from "ngx-cacheable";
import { EMPTY } from "rxjs";
const baseUri = environment.baseUri;
const memberCacheBuster$ = new Subject<void>();
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
  members$: BehaviorSubject<Array<Member>> = new BehaviorSubject([]);
  loggedOnMembers$: BehaviorSubject<Array<Member>> = new BehaviorSubject([]);
  staticData: Array<String>;

  constructor(private http: HttpClient, private socket: Socket) {
    this.loadMembers().subscribe(members => {
      console.log('new member list', members)
      this.members$.next(members as Array<Member>);
    });
  }

  ngOnInit() {
    this.loadMembers().subscribe(members => {
      console.log('new member list', members)
      this.members$.next(members as Array<Member>);
    });
  }

  async saveMemberToLocalStorage(_member: Member, initialFlag?: boolean) {
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
    if (initialFlag) this.initLoggedOnUsers();
  }

  getUser(): Member {
    if (this.user) {
      return this.user;
    }
  }

  updateUser(user) {
    this.user = user;
    let members = this.members$.getValue();
    members.forEach(mem => {
      if(mem._id == user._id) {
        mem = user;
      }
    });
    this.members$.next(members);
  }

  getUser$(): BehaviorSubject<Member> {
    return this.user$;
  }

  isMember() {
    return this.user != null;
  }

  getUserId(): string {
    if (this.user) {
      return this.user._id;
    }
  }

  getMemberById(id) {
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
  @Cacheable({ maxAge: 600000, cacheBusterObserver: memberCacheBuster$ })
  loadMembers() {
    console.log("loading members from server");
    return this.http.get(`${baseUri}/members`).pipe(
      map((members: Array<Member>) => {
        console.log('returned members from server')
        return members.map(member => {
          return this.enrichMember(member);
        });
      })
    );
  }

  loadMembersAndUpdateObservable() {
    this.loadMembers().subscribe(members => {
      console.log('new member list', members)
      this.members$.next(members as Array<Member>);
    });
  }
  
  initLoggedOnUsers() {
    this.members$.subscribe(() => {
      console.log("initing user listing");
      this.socket.on("logged-on-users", (users: Array<String>) => {
        let user = users.map(el => this.getMemberById(el));
        this.loggedOnMembers$.next(user);
      });
      console.log("get lgd on", this.user$.getValue());
      setTimeout(() => {
        this.socket.emit("get-logged-on-users", this.user$.getValue());
      });
    });
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
    member.age = this.calculateAge(member.birthyear);
    member.favouriteartists = member.favouriteartists.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    member.favouritefestivals = member.favouritefestivals.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    member.musictype = member.musictype.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    return member;
  }

  getMemberBySocialId(id) {
    return this.http.get(`${baseUri}/members/bysocialid/${id}`);
  }

  @CacheBuster({
    cacheBusterNotifier: memberCacheBuster$
  })
  createMember(member: Member) {
    return this.http.post(`${baseUri}/members/add`, { member: member });
  }

  updateMember(id, member) {
    return this.http.post(`${baseUri}/members/update/${id}`, {
      member: member
    });
  }

  deleteMember(id) {
    return this.http.get(`${baseUri}/members/delete/${id}`);
  }

  @Cacheable({ maxAge: 600000, cacheBusterObserver: memberCacheBuster$ })
  landingPageStats() {
    return this.http.get(`${baseUri}/members/landingpagestats`);
  }

  messageMember(message: Message) {
    console.log("sending message", message);
    return this.http.post(
      `${baseUri}/members/message/${message.receiver._id}`,
      { message: message }
    );
  }

  getAllCountries() {
    return countries;
  }

  getDropdownDisplay(dataset, value) {
    return dropdowns[dataset].filter(el => el.id === value)[0]["value"];
  }

  getStaticData() {
    return this.http
      .get(`${baseUri}/staticdata`)
      .pipe(tap((data: any) => (this.staticData = data)));
  }

  addStaticData(value) {
    console.log("adding static data", value);
    return this.http.post(`${baseUri}/staticdata/add`, value);
  }

  calculateAge(birthday) {
    let bdate = moment()
      .set("year", birthday)
      .toDate();
    var ageDifMs = Date.now() - bdate.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
}
