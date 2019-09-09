import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Member } from "../../models/member.model";
import { MemberService } from "../../services/member.service";
import { BehaviorSubject, of } from "rxjs";
import { DeviceDetectorService } from 'ngx-device-detector';

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
  focusMarker : any; 
  selectedMember$: BehaviorSubject<Member>;
  isMobile: boolean = false;
  members$: BehaviorSubject<Array<Member>>;
  headerInfo$: BehaviorSubject<any> = new BehaviorSubject({});
  constructor(
    private memberService: MemberService,
    private router: Router,
    private route: ActivatedRoute,
    private deviceDetectorService :DeviceDetectorService 
  ) {
    this.members$ = new BehaviorSubject(this.route.snapshot.data["data"]["members"]); 
    this.selectedMember$ = this.memberService.getUser$();
    this.headerInfo$.next({
      count :  this.route.snapshot.data["data"]["stats"]["count"],
      conversionPercent :  this.route.snapshot.data["data"]["stats"]["conversionPercent"]
    });
    this.isMobile = this.deviceDetectorService.isMobile();
  }

  ngOnInit() {
    this.generateMemberMap();
    this.selectedMember$.subscribe((member) => this.updateFocusedMember(member));
  }

  updateFocusedMember(member: Member) {
    console.log('focusing',member)
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

  generateMemberMap() {
    const mapProp = {
      zoom: 1,
      center: { lat: 22.28, lng: 114.158 },
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: true,
      rotateControl: false,
      fullscreenControl: true
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.members$.subscribe(members => 
      {
         members.forEach(el => {
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


  })
}

  centreMapOnUser() {
    let member: Member = JSON.parse(sessionStorage.getItem("member"));
    let memberLocation = new google.maps.LatLng(member.lat, member.long);
    this.map.setCenter(memberLocation);
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
