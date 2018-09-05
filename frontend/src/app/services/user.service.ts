import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  uri = 'http://localhost:4000';
  countriesUri = 'https://restcountries.eu/rest/v2/all';
  countries;

  constructor(private http: HttpClient) {
  }



  getUsers() {
    return this.http.get(`${this.uri}/users`);
  }

  getUserById(id) {
    return this.http.get(`${this.uri}/users/${id}`)
  }

  getUserBySocialId(id) {
    return this.http.get(`${this.uri}/users/bysocialid/${id}`)
  }

  createUser(user: User) {
    debugger;
    return this.http.post(`${this.uri}/users/add`, user);
  }

  updateUser(id, user)  {
    return this.http.post(`${this.uri}/users/update/${id}`, user);
  }

  deleteUser(id) {
    return this.http.get(`${this.uri}/users/delete/${id}`);
  }

  getAllCountries() {
    return this.http.get(this.countriesUri);
  }

  getGoogleAvatar(user: User) {
    return this.http.get("http://picasaweb.google.com/data/entry/api/user/"
    + user.email + "?alt=json");
  }

}
