/// <reference types="@types/googlemaps" />

import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Member } from "../../models/member.model";
import { MemberService } from "../../services/member.service";
import { TokenService } from "../../services/token.service";
import { ViewChild } from "@angular/core";
import { AuthService, SocialUser } from "angularx-social-login";
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.css"]
})
export class LandingComponent implements OnInit {
  @ViewChild("gmap", { static: true }) gmapElement: any;
  @ViewChild("gmap2", { static: true }) gmap2Element: any;
  map: google.maps.Map;
  map2: google.maps.Map;
  members: Member[];
  loggedInMember: Member;
  memberCount: number = 0;
  conversionPercent: number = 0;
  user: SocialUser;
  loggedIn: boolean;
  mapOpened: boolean = false;

  constructor(
    private memberService: MemberService,
    private socialAuthService: AuthService,
    private router: Router,
    private tokenService: TokenService,
    private route: ActivatedRoute
  ) {
    this.members = this.route.snapshot.data["data"]["members"];
    this.memberCount = this.route.snapshot.data["data"]["stats"]["count"];
    this.conversionPercent = this.route.snapshot.data["data"]["stats"]["conversionPercent"];
  }

  ngOnInit() {
    this.generateMemberMap();

    this.socialAuthService.authState.subscribe(user => {
      console.log("signed in user", user);
      this.user = user;
      this.loggedIn = user != null;
      if (user) {
        this.memberService.getMemberBySocialId(user.id).subscribe(member => {
          if (!member) this.router.navigate(["register", "social"]);
          else {
            this.loggedInMember = member;
            sessionStorage.setItem("member", JSON.stringify(member));
            this.tokenService.login(user.id).subscribe(token => {
              this.router.navigate(["nav/list"]);
            });
          }
        });
      }
    });
  }

  public openCloseMap(isOpened: boolean) {
    this.mapOpened = isOpened;
  }

  public closeWindow() {
    this.mapOpened = false;
  }

  generateMemberMap() {
    let mapProp = {
      zoom: 1,
      center: { lat: 22.28, lng: 114.158 },
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false
    };
    const bounds = new google.maps.LatLngBounds();
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.map2 = new google.maps.Map(this.gmap2Element.nativeElement, mapProp);
    this.members.forEach((el: Member) => {
      if (el.lat && el.long) {
        let location = new google.maps.LatLng(el.lat, el.long);
        let marker = new google.maps.Marker({
          position: location,
          map: this.map,
          title: "Got you!"
        });
        let marker2 = new google.maps.Marker({
          position: location,
          map: this.map2,
          title: "Got you!"
        });
        var infowindow = new google.maps.InfoWindow({
          content: el.fname + " " + el.lname + " thinks psytrance is " + el.psystatus
        });
        marker.addListener("mouseover", () => {
          infowindow.open(this.map, marker);
        });
        marker.addListener("mouseout", () => {
          infowindow.close();
        });
        marker2.addListener("mouseover", () => {
          infowindow.open(this.map, marker);
        });
        marker2.addListener("mouseout", () => {
          infowindow.close();
        });
        // bounds.extend(location);
      }
    });
    // this.map.fitBounds(bounds);

    this.memberService.landingPageStats().subscribe(data => {
      this.memberCount = data["count"];
      this.conversionPercent = Math.round(data["conversionPercent"]);
    });
    // let center = new google.maps.LatLng(this.members[0].lat, this.members[0].long);
    // console.log("loggedInMember", this.loggedInMember);
    // let loggedInMemberLocation = new google.maps.LatLng(
    //   this.loggedInMember.lat,
    //   this.loggedInMember.long
    // );
    // this.map.setCenter(center);
  }

  signInWithGoogle(): void {
    console.log("google sign in");
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(memberData => {
      console.log("memberData", memberData);
    });
  }

  signInWithFB(): void {
    console.log("facebook sign in");
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then(memberData => {
      console.log("memberData", memberData);
    });
  }

  public register() {
    this.router.navigate(["register", "new"]);
  }
}
