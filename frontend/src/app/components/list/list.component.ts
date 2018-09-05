import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  displayedColumns = ['fname', 'lname', 'birthyear','origin', 'postcode', 'psystatus', 'reason', 'actions'];
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  users : User[];

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.fetchUsers();
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

  fetchUsers() {
    this.userService.getUsers().subscribe((data: User[]) => {
      this.users = data;
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
    });
  }

  editUser(id) {
      this.router.navigate([`/nav/edit/${id}`]);
    }

  deleteUser(id) {
    this.userService.deleteUser(id).subscribe(() => {
      this.fetchUsers();
    });
  }

}
