import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor(private router : Router) { }

  ngOnInit() {
  }

  navigateToProfile() {
      let user = JSON.parse(sessionStorage.getItem('user'));
      this.router.navigate(['/nav/edit/' + user._id]);
  }
}
