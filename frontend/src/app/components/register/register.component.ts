import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { UserService } from "../../services/user.service";
import { MatSnackBar } from "@angular/material";
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user : any;
  registerForm : FormGroup;
  mapVisible = false;
  latitude : any;
  longitude : any;
  basicInfoGroup: FormGroup;
  opinionGroup: FormGroup;
  countries : any;
  origin = new FormControl();
  filteredCountries: Observable<string[]>;
  originSelected : string;
  psystatusSelected : string;
  birthyearChoices : Array<string>;
  birthyearSelected : number;
  avatarUrl : string;


  constructor(private router : Router, private activatedRoute: ActivatedRoute,
    private userService : UserService, private snackBar : MatSnackBar, private fb : FormBuilder) {
      this.createForm();
    }

  ngOnInit() {
    this.buildBirthyearChoices();

      this.user = JSON.parse(sessionStorage.getItem('user'));
      console.log('inited with ', this.user);
      this.userService.getGoogleAvatar(this.user).subscribe(res => {
        // debugger;
        this.avatarUrl = res['entry']['gphoto$thumbnail']['$t'];
        console.log(res, this.avatarUrl)
      this.basicInfoGroup.get('fname').setValue(this.user.fname);
      this.basicInfoGroup.get('lname').setValue(this.user.lname);
      this.basicInfoGroup.get('email').setValue(this.user.email);
      this.basicInfoGroup.get('gender').setValue(this.user.gender);
      this.basicInfoGroup.get('postcode').setValue(this.user.postcode);
      this.basicInfoGroup.get('origin').setValue(this.user.origin);
      this.basicInfoGroup.get('birthyear').setValue(this.user.birthyear);
      this.birthyearSelected = this.user.birthyear;
      this.opinionGroup.get('psystatus').setValue(this.user.psystatus);
      this.psystatusSelected = this.user.psystatus;
      this.opinionGroup.get('reason').setValue(this.user.reason);
      this.userService.getAllCountries().subscribe((data:  Array<object>) => {
        this.countries  =  data.map(el => el['name']);
        this.filteredCountries = this.origin.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
        this.countries.forEach((el) => {
          if(el === this.user.origin) {
            this.originSelected = el;
          }
        })

    });
      })
    // })
    }

    buildBirthyearChoices() {
      var vals = [];
      var dt=  new Date();
      var year = dt.getFullYear();
      for(var i =100; i >= 0; i--) {
        vals.push(year - i);
      }

      this.birthyearChoices = Array.from(vals.reverse());
    }
    createForm() {
      this.basicInfoGroup = this.fb.group({
        fname : ['', Validators.required],
        lname : ['', Validators.required],
        gender : ['', Validators.required],
        email : ['', [Validators.required, Validators.email]],
        origin : ['', Validators.required],
        birthyear : ['', Validators.required],
        postcode : ['', Validators.required]
      });
      this.opinionGroup = this.fb.group({
        psystatus : ['', Validators.required],
        reason : ['', Validators.required],
      });

  }

  getErrorMessage() {
    return this.basicInfoGroup.get('email').hasError('required') ? 'You must enter a value' :
    this.basicInfoGroup.get('email').hasError('email') ? 'Not a valid email' : '';
  }

  setLatLng(event : Event) {
    this.latitude = event['lat'];
    this.longitude = event['lng'];
  }

  setOrigin(event: Event, country : string) {
    this.basicInfoGroup.get('origin').setValue(event['source']['value']);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.countries.filter(option => option.toLowerCase().includes(filterValue));
  }


get gender() {
  return this.basicInfoGroup.get('gender');
}

registerUser(fname, lname, gender, email, birthyear, origin, postcode, psystatus, reason) {
    let updateUser : User = {
      fname : fname,
      lname : lname,
      socialid : this.user.socialid,
      gender : gender,
      birthyear : birthyear,
      origin : origin,
      postcode : postcode,
      email : email,
      lat : this.latitude,
      long : this.longitude,
      psystatus : psystatus,
      reason : reason
    };
    if(this.user._id) {
      console.log("updating ", updateUser)
      this.userService.updateUser(this.user._id, updateUser).subscribe((user) => {
        sessionStorage.setItem('user', JSON.stringify(user));
        let snackBarRef = this.snackBar.open('Successfully updated','OK', {
          duration : 2000
        });
        snackBarRef.afterDismissed().subscribe(() => {
          this.router.navigate(['/list']);
        });
      });
    }
    else {
      console.log("creating ", updateUser)
      this.userService.createUser(updateUser).subscribe((user) => {
        sessionStorage.setItem('user', JSON.stringify(user));
        let snackBarRef = this.snackBar.open('Successfully updated','OK', {
          duration : 2000
        });
        snackBarRef.afterDismissed().subscribe(() => {
          this.router.navigate(['/list']);
        });
      });
    }

  }

}
