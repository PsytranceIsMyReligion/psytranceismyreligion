/// <reference types="@types/googlemaps" />

import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Member } from "../../models/member.model";
import { MemberService } from "../../services/member.service";
import { TokenService } from "../../services/token.service";
import { ViewChild } from "@angular/core";
import { AuthService, SocialUser } from "angularx-social-login";
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from "angularx-social-login";

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
    this.memberService.members$.subscribe(mems => {
      this.members = mems;
    });
    this.memberCount = this.route.snapshot.data["data"]["stats"]["count"];
    this.conversionPercent = this.route.snapshot.data["data"]["stats"][
      "conversionPercent"
    ];
  }

  ngOnInit() {
    console.log('landing init')
    this.generateMemberMap();

    this.socialAuthService.authState.subscribe(user => {
      this.user = user;
      this.loggedIn = user != null;
      if (user) {
        this.memberService
          .getMemberBySocialId(user.id)
          .subscribe((member: Member) => {
            if (!member) this.router.navigate(["/nav/register/new"]);
            else {
              this.loggedInMember = member;
              console.log("saving member");
              this.memberService.saveMemberToLocalStorage(member, true);
              this.tokenService.login(user).subscribe(token => {
                this.router.navigate(["/nav/home"]);
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
      center: { lat: this.members[0].lat, lng: this.members[0].long },
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.map2 = new google.maps.Map(this.gmap2Element.nativeElement, mapProp);
    this.members.forEach((el: Member) => {
      if (el.lat && el.long) {
        let location = new google.maps.LatLng(el.lat, el.long);
        let marker = new google.maps.Marker({
          position: location,
          map: this.map
        });
        let marker2 = new google.maps.Marker({
          position: location,
          map: this.map2
        });
        var infowindow = new google.maps.InfoWindow({
          content: el.uname + " thinks psytrance is " + el.psystatus
        });
        marker.addListener("mouseover", () => {
          infowindow.open(this.map, marker);
        });
        marker.addListener("mouseout", () => {
          infowindow.close();
        });
        marker2.addListener("mouseover", () => {
          infowindow.open(this.map2, marker2);
        });
        marker2.addListener("mouseout", () => {
          infowindow.close();
        });
      }
    });

    this.memberService.landingPageStats().subscribe(data => {
      this.memberCount = data["count"];
      this.conversionPercent = Math.round(data["conversionPercent"]);
    });
  }

  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
}
