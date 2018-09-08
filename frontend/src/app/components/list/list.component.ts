import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Member } from '../../models/member.model';
import { MemberService } from '../../services/member.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  displayedColumns = ['fname', 'lname', 'birthyear','origin', 'postcode', 'psystatus', 'reason', 'actions'];
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  members : Member[];
  memberCount : number;
  conversionPercent : number;

  constructor(private memberService: MemberService, private router: Router) { }

  ngOnInit() {
    this.fetchMembers();
    const mapProp = {
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
      const bounds = new google.maps.LatLngBounds();
      data.forEach((el) => {
        if ( el.lat && el.long ) {
         const location = new google.maps.LatLng(el.lat, el.long);
        const marker = new google.maps.Marker({
          position: location,
          map: this.map
        });
        var infowindow = new google.maps.InfoWindow({
          content: el.fname + ' ' + el.lname + ' says ' + el.psystatus
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

  focusMember(member) {
    const location = new google.maps.LatLng(member.lat, member.long);
    this.map.panTo(location);
  }

  editMember(id) {
      this.router.navigate([`/nav/edit/${id}`]);
    }

  deleteMember(id) {
    this.memberService.deleteMember(id).subscribe(() => {
      this.fetchMembers();
    });
  }

}
