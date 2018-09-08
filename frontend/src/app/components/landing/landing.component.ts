 /// <reference types="@types/googlemaps" />

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Member } from '../../models/member.model';
import { MemberService } from '../../services/member.service';
import { TokenService } from '../../services/token.service';
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
  members : Member[];
 memberCount : number = 0;
 conversionPercent : number = 0;

  constructor(private memberService: MemberService, private socialAuthService: AuthService,
    private router : Router, private  tokenService : TokenService) { }

  ngOnInit() {

    console.log('expired',this.tokenService.isTokenExpired())
    this.tokenService.logout();

    this.fetchMembers();
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

  fetchMembers() {
    this.memberService.getMembers().subscribe((data: Member[]) => {
      this.members = data;
      var bounds = new google.maps.LatLngBounds();
      this.members.forEach((el:Member) => {
        if(el.lat && el.long) {
        let location = new google.maps.LatLng(el.lat, el.long);
        let marker = new google.maps.Marker({
          position: location,
          map: this.map,
          title: 'Got you!'
        });
        var infowindow = new google.maps.InfoWindow({
          content: el.fname + ' ' + el.lname + ' thinks psytrance is ' + el.psystatus
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
      this.memberService.landingPageStats().subscribe((data) => {
        console.log(data);
        this.memberCount = data['count'];
        this.conversionPercent = Math.round(data['conversionPercent']);
    })
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
      (memberData) => {
       this.memberService.getMemberBySocialId(memberData.id)
        .subscribe(member => {
          console.log('member', member);
          if(!member)
              this.router.navigate(['register','social']);
          else {
            console.log('member found', member)
            sessionStorage.setItem('member', JSON.stringify(member));
            this.tokenService.login(memberData.id).subscribe((token)  =>{
              this.router.navigate(['nav/list']);
            });
          }
        })
      }
    );
  }
    public register() {
      this.router.navigate(['register','new']);
    }
  }
