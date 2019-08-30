import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Member } from "../../models/member.model";
import { MemberService } from "../../services/member.service";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"]
})
export class ListComponent implements OnInit {
  displayedColumns = [
    "fname",
    "lname",
    "birthyear",
    "origin",
    "postcode",
    "psystatus",
    "reason",
    "actions"
  ];
  @ViewChild("gmap", { static: true }) gmapElement: any;
  map: google.maps.Map;
  members: Member[];
  memberCount: number;
  conversionPercent: number;
  focusMarker : any;

  constructor(
    private memberService: MemberService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.members = this.route.snapshot.data["data"]["members"];
    this.memberCount = this.route.snapshot.data["data"]["stats"]["count"];
    this.conversionPercent = this.route.snapshot.data["data"]["stats"]["conversionPercent"];
  }

  ngOnInit() {
    this.generateMemberMap();
  }

  generateMemberMap() {
    const mapProp = {
      zoom: 1,
      center: { lat: 22.28, lng: 114.158 },
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.members.forEach(el => {
      if (el.lat && el.long) {
        const location = new google.maps.LatLng(el.lat, el.long);
        const marker = new google.maps.Marker({
          position: location,
          map: this.map
        });
        var infowindow = new google.maps.InfoWindow({
          content: el.fname + " " + el.lname + " says " + el.psystatus
        });
        marker.addListener("mouseover", () => {
          infowindow.open(this.map, marker);
        });
        marker.addListener("mouseout", () => {
          infowindow.close();
        });
      }
    });

    let member: Member = JSON.parse(sessionStorage.getItem("member"));
    let memberLocation = new google.maps.LatLng(member.lat, member.long);
    this.map.setCenter(memberLocation);
  }

  focusMember(member) {
    const location = new google.maps.LatLng(member.lat, member.long);
    let marker = new google.maps.Marker({
      position: location,
      map: this.map
    });
    marker.setAnimation(google.maps.Animation.DROP);
    marker.setIcon('http://maps.google.com/intl/en_us/mapfiles/ms/micons/purple.png');
    if(this.focusMarker) {
      this.focusMarker.setMap(null);
    }
    this.focusMarker = marker;
    this.map.panTo(location);
  }

  editMember(id) {
    this.router.navigate([`/nav/edit/${id}`]);
  }

  deleteMember(id) {
    this.memberService.deleteMember(id).subscribe(() => {
      this.generateMemberMap();
    });
  }
}
