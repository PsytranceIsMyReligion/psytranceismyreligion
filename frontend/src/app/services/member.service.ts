import { Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';
import { Member } from '../models/member.model';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  uri = 'http://localhost:4000';
  countriesUri = 'https://restcountries.eu/rest/v2/all';
  countries;

  constructor(private http: HttpClient) {
  }



  getMembers() {
    return this.http.get(`${this.uri}/members`);
  }

  getMemberById(id) {
    return this.http.get(`${this.uri}/members/${id}`)
  }

  getMemberBySocialId(id) {
    return this.http.get(`${this.uri}/members/bysocialid/${id}`)
  }

  createMember(member: Member) {
    return this.http.post(`${this.uri}/members/add`, member);
  }

  updateMember(id, member)  {
    return this.http.post(`${this.uri}/members/update/${id}`, member);
  }

  deleteMember(id) {
    return this.http.get(`${this.uri}/members/delete/${id}`);
  }

  landingPageStats() {
    return this.http.get(`${this.uri}/members/landingpagestats`);
  }

  getAllCountries() {
    return this.http.get(this.countriesUri);
  }

  getGoogleAvatar(member: Member) {
    return this.http.get("http://picasaweb.google.com/data/entry/api/user/"
    + member.email + "?alt=json");
  }

}
