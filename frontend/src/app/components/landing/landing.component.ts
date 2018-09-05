 /// <reference types="@types/googlemaps" />

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { ViewChild } from '@angular/core';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider
} from 'angular-6-social-login';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {


  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  users : User[];

  constructor(private userService: UserService, private socialAuthService: AuthService,
    private router : Router) { }

  ngOnInit() {
    this.fetchUsers();
    let mapProp = {
      zoom: 0,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
  }

  fetchUsers() {
    this.userService.getUsers().subscribe((data: User[]) => {
      this.users = data;
      var bounds = new google.maps.LatLngBounds();
      this.users.forEach((el:User) => {
        if(el.lat && el.long) {
        let location = new google.maps.LatLng(el.lat, el.long);
        let marker = new google.maps.Marker({
          position: location,
          map: this.map,
          title: 'Got you!'
        });
        var infowindow = new google.maps.InfoWindow({
          content: el.fname + ' ' + el.lname + ' thinks psytrance ' + el.psystatus
        });
        marker.addListener('mouseover', function() {
          infowindow.open(this.map, marker);
        });
        marker.addListener('mouseout', function() {
          infowindow.close();
      });
        bounds.extend(location);
      }
      });
      this.map.fitBounds(bounds);
    });
  }

  public socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if ( socialPlatform === 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if ( socialPlatform === 'google' ) {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        debugger;
       this.userService.getUserBySocialId(userData.id)
        .subscribe(user => {
          debugger;
          if(!user) {
              let toSave : User = { socialid : userData.id,
                                     email : userData.email,
                                     fname : userData.name.substring(0, userData.name.indexOf(' ')),
                                     lname : userData.name.substring(userData.name.indexOf(' ')+1, userData.name.length),
                                     };
                let userJSON: string = JSON.stringify(toSave);
                sessionStorage.setItem('user', userJSON);
                this.router.navigate(['register']);
          } else {
            sessionStorage.setItem('user', JSON.stringify(user));
            this.router.navigate(['nav/list']);
          }
      }
    );
  }
}
