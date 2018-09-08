import { Component, OnInit } from '@angular/core';
import { Member } from '../../models/member.model';
import { Router, ActivatedRoute, ParamMap  } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { MemberService } from "../../services/member.service";
import { MatSnackBar } from "@angular/material";
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  member : any;
  registerForm : FormGroup;
  mapVisible = false;
  latitude : any;
  longitude : any;
  basicInfoGroup: FormGroup;
  opinionGroup: FormGroup;
  detailGroup: FormGroup;
  countries : any;
  origin = new FormControl();
  filteredCountries: Observable<string[]>;
  originSelected : string;
  psystatusSelected : string;
  birthyearChoices : Array<string>;
  birthyearSelected : number;
  membertypeSelected : string;
  musictypeSelected : string;
  startyearSelected : number;
  startyearChoices : Array<string>;
  partyfrequencySelected : string;
  festivalfrequencySelected : string;

  avatarUrl : string = null;
  newMode : boolean = true;


  constructor(private router : Router, private activatedRoute: ActivatedRoute,
    private memberService : MemberService, private snackBar : MatSnackBar, private fb : FormBuilder) {
      this.createForm();
      this.newMode = this.activatedRoute.snapshot.paramMap.get('mode') === 'new' ? true : false;
      console.log('newMode', this.newMode)
    }

  ngOnInit() {
    this.buildBirthyearChoices();

      this.member = JSON.parse(sessionStorage.getItem('member'));
      if(this.member && this.member.socialid) {
        console.log('social member')
        this.memberService.getGoogleAvatar(this.member).subscribe(res => {
        this.avatarUrl = res['entry']['gphoto$thumbnail']['$t'];
          this.loadRegistrationForm();
        })
      } else {
        this.loadRegistrationForm();
      }

    }

    loadRegistrationForm() {
      if(this.member) {
        console.log('member', this.member)
        this.basicInfoGroup.get('fname').setValue(this.member.fname);
        this.basicInfoGroup.get('lname').setValue(this.member.lname);
        this.basicInfoGroup.get('email').setValue(this.member.email);
        this.basicInfoGroup.get('gender').setValue(this.member.gender);
        this.basicInfoGroup.get('postcode').setValue(this.member.postcode);
        this.basicInfoGroup.get('origin').setValue(this.member.origin);
        this.basicInfoGroup.get('birthyear').setValue(this.member.birthyear);
        this.birthyearSelected = this.member.birthyear;
        this.opinionGroup.get('psystatus').setValue(this.member.psystatus);
        this.psystatusSelected = this.member.psystatus;
        this.opinionGroup.get('reason').setValue(this.member.reason);
        this.detailGroup.get('membertype').setValue(this.member.membertype);
        this.membertypeSelected = this.member.membertype;
        this.detailGroup.get('musictype').setValue(this.member.musictype);
        this.musictypeSelected = this.member.musictype;
        this.detailGroup.get('startyear').setValue(this.member.startyear);
        this.startyearSelected = this.member.startyear;
        this.detailGroup.get('bio').setValue(this.member.bio);
        this.detailGroup.get('favouriteparty').setValue(this.member.favouriteparty);
        this.detailGroup.get('partyfrequency').setValue(this.member.partyfrequency);
        this.partyfrequencySelected = this.member.partyfrequency;
        this.detailGroup.get('festivalfrequency').setValue(this.member.festivalfrequency);
        this.festivalfrequencySelected = this.member.festivalfrequency;
        this.detailGroup.get('favouritefestival').setValue(this.member.favouritefestival);
        this.detailGroup.get('facebookurl').setValue(this.member.facebookurl);
        this.detailGroup.get('soundcloudurl').setValue(this.member.soundcloudurl);
        this.detailGroup.get('websiteurl').setValue(this.member.websiteurl);
      }
      this.loadCountries();
    }

    loadCountries() {
      this.memberService.getAllCountries().subscribe((data:  Array<object>) => {
        this.countries  =  data.map(el => el['name']);
        this.filteredCountries = this.origin.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
        if(this.member) {
          this.countries.forEach((el) => {
            if(el === this.member.origin) {
              this.originSelected = el;
            }
          })
        }
      });
    }

    buildBirthyearChoices() {
      var vals = [];
      var dt=  new Date();
      var year = dt.getFullYear();
      for(var i =100; i >= 0; i--) {
        vals.push(year - i);
      }
      this.birthyearChoices = Array.from(vals.reverse());
      this.startyearChoices = this.birthyearChoices;

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
      this.detailGroup = this.fb.group({
        musictype : ['', Validators.required],
        membertype : ['', Validators.required],
        startyear : ['', Validators.required],
        bio : [''],
        favouriteparty : [''],
        partyfrequency : [''],
        favouritefestival : [''],
        festivalfrequency : [''],
        facebookurl : [''],
        soundcloudurl : [''],
        websiteurl : ['']

      })
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

  public compareFn(x, y) {
    return x && y ? x===y : x ===y;
  }


  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.countries.filter(option => option.toLowerCase().includes(filterValue));
  }


get gender() {
  return this.basicInfoGroup.get('gender');
}

registerMember(fname, lname, gender, email, birthyear, origin, postcode, psystatus, reason,  musictype,
   membertype, startyear, bio, partyfrequency, favouriteparty, festivalfrequency, favouritefestival) {
    let updateMember : Member = {
      fname : fname,
      lname : lname,
      socialid : this.member? this.member.socialid : null,
      gender : gender,
      birthyear : birthyear,
      origin : origin,
      postcode : postcode,
      email : email,
      lat : this.latitude,
      long : this.longitude,
      psystatus : psystatus,
      reason : reason,
      membertype : membertype,
      musictype: musictype,
      startyear: startyear,
      bio : bio,
      partyfrequency : partyfrequency,
      favouriteparty : favouriteparty,
      festivalfrequency : festivalfrequency,
      favouritefestival : favouritefestival
    };
    if(this.member && this.member._id) {
      this.memberService.updateMember(this.member._id, updateMember).subscribe((member) => {
        sessionStorage.setItem('member', JSON.stringify(member));
        let snackBarRef = this.snackBar.open('Successfully updated','OK', {
          duration : 2000
        });
        snackBarRef.afterDismissed().subscribe(() => {
          this.router.navigate(['/nav/list']);
        });
      });
    }
    else {
      this.memberService.createMember(updateMember).subscribe((member) => {
        sessionStorage.setItem('member', JSON.stringify(member));
        let snackBarRef = this.snackBar.open('Successfully updated','OK', {
          duration : 2000
        });
        snackBarRef.afterDismissed().subscribe(() => {
          this.router.navigate(['/nav/list']);
        });
      });
    }

  }

}
