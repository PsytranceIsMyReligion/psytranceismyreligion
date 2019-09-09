import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Member } from "../../models/member.model";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MemberService } from "../../services/member.service";
import { MatSnackBar } from "@angular/material";
import { MatDatepicker } from "@angular/material/datepicker";
import { Observable, from } from 'rxjs';
import { delay, switchMap, map, tap, startWith } from 'rxjs/operators';
import { AuthService, SocialUser } from "angularx-social-login";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import * as moment from "moment";
import { Moment } from "moment";
import { TokenService } from "../../services/token.service";
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { environment } from '../../../environments/environment';

export const MY_FORMATS = {
  parse: {
    dateInput: "YYYY"
  },
  display: {
    dateInput: "YYYY",
    monthYearLabel: "YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "YYYY"
  }
};

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  mapVisible = false;
  latitude: any;
  longitude: any;
  basicInfoGroup: FormGroup;
  opinionGroup: FormGroup;
  detailGroup: FormGroup;
  genderSelected: string;
  countries: any;
  filteredCountriesOrigin: Observable<any[]>;
  filteredCountriesLocation: Observable<any[]>;
  filteredMusicGenres: Observable<string[]>;
  startyearChoices: Array<string>;
  yearStart: Date;
  minDate: Date;
  maxDate: Date;
  avatarUrl: string = null;
  newMode: boolean = true;
  user: SocialUser;
  socialid: string;
  member: Member = {};
  musicGenres: any;
  selectedMusicGenres: any = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  env = environment;
  data: Array<{ text: string, _id: number }>;

  @ViewChild("musicGenreList", { static: false }) musicGenreList;
  

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private memberService: MemberService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private socialAuthService: AuthService,
    private tokenService: TokenService
  ) {
    this.newMode = this.activatedRoute.snapshot.paramMap.get("mode") === "new" ? true : false;
    this.countries = this.activatedRoute.snapshot.data["data"]["countries"];
    this.musicGenres = this.activatedRoute.snapshot.data["data"]["musicGenres"];
    this.data = this.musicGenres.slice();
  }

  ngOnInit() {
    this.createForm();
    this.initializeFilters();
    this.loadSocialUser();
    this.yearStart = moment()
      .add(-18, "year")
      .toDate();
    this.maxDate = moment().toDate();
    this.minDate = moment()
      .add(-90, "year")
      .toDate();
  }

  ngAfterViewInit() {
    const contains = value => s => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    this.musicGenreList.filterChange.asObservable().pipe(
      switchMap(value => from([this.musicGenres]).pipe(
          tap((value) => { this.musicGenreList.loading = true}),
          map((data) => data.filter(contains(value)))
        ))
    )
    .subscribe(x => {
        this.data = x;
        this.musicGenreList.loading = false;
    });
  }

  loadSocialUser() {
    this.socialAuthService.authState.subscribe(user => {
      if (user) {
        this.user = user;
        this.basicInfoGroup.get("fname").setValue(this.user.firstName);
        this.basicInfoGroup.get("lname").setValue(this.user.lastName);
        this.basicInfoGroup.get("email").setValue(this.user.email);
        this.socialid = this.user.id;
        this.avatarUrl = user.photoUrl;
        this.loadRegistrationForm();
      }
    });
  }

  loadRegistrationForm() {
    this.member = JSON.parse(sessionStorage.getItem("member"));
    if (this.member) {
      console.log("loading member details to", this.member);
      this.socialid = this.member.socialid;
      this.basicInfoGroup.get("uname").setValue(this.member.uname);
      this.basicInfoGroup.get("fname").setValue(this.member.fname);
      this.basicInfoGroup.get("lname").setValue(this.member.lname);
      this.basicInfoGroup.get("email").setValue(this.member.email);
      this.genderSelected = this.member.gender;
      this.basicInfoGroup.get("postcode").setValue(this.member.postcode);
      this.basicInfoGroup.get("origin").setValue(this.countries.filter(el => el.alpha2Code === this.member.origin));
      this.basicInfoGroup.get("location").setValue(this.countries.filter(el => el.alpha2Code === this.member.location));
      this.basicInfoGroup.get("birthyear").setValue(moment().set("year", this.member.birthyear));
      this.opinionGroup.get("psystatus").setValue(this.member.psystatus);
      this.opinionGroup.get("reason").setValue(this.member.reason);
      this.detailGroup.get("membertype").setValue(this.member.membertype);
      this.detailGroup.get("musictype").setValue(this.member.musictype);
      this.detailGroup.get("startyear").setValue(moment().set("year", this.member.startyear));
      this.detailGroup.get("bio").setValue(this.member.bio);
      this.detailGroup.get("favouriteparty").setValue(this.member.favouriteparty);
      this.detailGroup.get("partyfrequency").setValue(this.member.partyfrequency);
      this.detailGroup.get("festivalfrequency").setValue(this.member.festivalfrequency);
      this.detailGroup.get("favouritefestival").setValue(this.member.favouritefestival);
      this.detailGroup.get("facebookUrl").setValue(this.member.facebookUrl);
      this.detailGroup.get("soundcloudUrl").setValue(this.member.soundcloudUrl);
      this.detailGroup.get("websiteUrl").setValue(this.member.websiteUrl);
    }
    console.log(this.member.avatarUrl);
  }

  setLocation(event) {
    this.basicInfoGroup.get("postcode").setValue("");
  }

  initializeFilters() {
    this.filteredCountriesOrigin = this.basicInfoGroup.get("origin").valueChanges.pipe(
      startWith(""),
      map(value => (value ? this.countryFilter(value) : this.countries.slice()))
    );
    this.filteredCountriesLocation = this.basicInfoGroup.get("location").valueChanges.pipe(
      startWith(""),
      map(value => (value ? this.countryFilter(value) : this.countries.slice()))
    );
  }



  countryFilter(value): any[] {
    if (value) {
      if (value.alpha2Code) {
        return this.countries.filter(option =>
          option.alpha2Code.toLowerCase().includes(value.alpha2Code.toLowerCase())
        );
      } else {
        return this.countries.filter(option =>
          option.name.toLowerCase().includes(value.toLowerCase())
        );
      }
    }
  }

  displayFn(country) {
    if (Array.isArray(country) && country.length > 0)
      return typeof country[0] !== "string" ? country[0].name : country[0];
    else return typeof country !== "string" ? country.name : country;
  }

  getErrorMessage() {
    return this.basicInfoGroup.get("email").hasError("required")
      ? "You must enter a value"
      : this.basicInfoGroup.get("email").hasError("email")
        ? "Not a valid email"
        : "";
  }

  setLatLng(event: Event) {
    this.latitude = event["lat"];
    this.longitude = event["lng"];
  }

  birthYearSelected(momentYear: Moment, datepicker: MatDatepicker<Moment>) {
    this.basicInfoGroup.get("birthyear").setValue(moment().set("year", momentYear.year()));
    this.basicInfoGroup.get("birthyear").markAsDirty();
    datepicker.close();
  }

  partyStartYearSelected(momentYear: Moment, datepicker: MatDatepicker<Moment>) {
    this.detailGroup.get("startyear").setValue(moment().set("year", momentYear.year()));
    this.detailGroup.get("startyear").markAsDirty();
    datepicker.close();
  }

  public compareFn(x, y) {
    return x && y ? x === y : x === y;
  }

  get gender() {
    return this.basicInfoGroup.get("gender");
  }

  registerMember() {
    let updateMember: Member = {
      uname: this.basicInfoGroup.get("uname").value,
      fname: this.basicInfoGroup.get("fname").value,
      lname: this.basicInfoGroup.get("lname").value,
      socialid: this.socialid,
      gender: this.genderSelected,
      birthyear: this.basicInfoGroup.get("birthyear").value.year(),
      origin: this.getAlpha2Code("origin"),
      location: this.getAlpha2Code("location"),
      postcode: this.basicInfoGroup.get("postcode").value,
      email: this.basicInfoGroup.get("email").value,
      lat: this.latitude,
      long: this.longitude,
      membertype: this.detailGroup.get("membertype").value,
      musictype: this.detailGroup.get("musictype").value,
      startyear: this.detailGroup.get("startyear").value.year(),
      bio: this.detailGroup.get("bio").value,
      partyfrequency: this.detailGroup.get("partyfrequency").value,
      favouriteparty: this.detailGroup.get("favouriteparty").value,
      festivalfrequency: this.detailGroup.get("festivalfrequency").value,
      favouritefestival: this.detailGroup.get("favouritefestival").value,
      websiteUrl: this.detailGroup.get("websiteUrl").value,
      facebookUrl: this.detailGroup.get("facebookUrl").value,
      soundcloudUrl: this.detailGroup.get("soundcloudUrl").value,
      psystatus: this.opinionGroup.get("psystatus").value,
      reason: this.opinionGroup.get("reason").value,
      avatarUrl: this.avatarUrl
    };
    if (this.member && this.member._id) {
      console.log("updating ", updateMember);
      this.memberService.updateMember(this.member._id, updateMember).subscribe(member => {
        this.memberService.saveMemberToLocalStorage(updateMember);
        let snackBarRef = this.snackBar.open("Successfully updated", "OK", {
          duration: 2000
        });
        snackBarRef.afterDismissed().subscribe(() => {
          this.router.navigate(["/list"]);
        });
      });
    } else {
      console.log("creating ", updateMember);
      this.memberService.createMember(updateMember).subscribe((member: Member) => {
        sessionStorage.setItem("member", JSON.stringify(member));
        let snackBarRef = this.snackBar.open("Successfully updated", "OK", {
          duration: 2000
        });
        snackBarRef.afterDismissed().subscribe(() => {
          this.tokenService.login(member._id.toString()).subscribe(res => {
            console.log("res", res);
            this.router.navigate(["/nav/list"]);
          });
        });
      });
    }
  }

  getAlpha2Code(field: string) {
    let location = this.basicInfoGroup.get(field).value;
    let locationCode;
    if (Array.isArray(location)) {
      locationCode = location[0].alpha2Code;
    } else locationCode = location.alpha2Code;
    return locationCode;
  }

  createForm() {
    this.basicInfoGroup = this.fb.group({
      uname:  ["", this.env.production ? Validators.required : null],
      fname: ["", this.env.production ? Validators.required : null],
      lname: ["", this.env.production ? Validators.required : null],
      gender: ["", this.env.production ? Validators.required : null],
      email: ["", this.env.production ? [Validators.required, Validators.email] : null],
      origin: ["", this.env.production ? Validators.required : null],
      location: ["", this.env.production ? Validators.required : null],
      birthyear: ["", this.env.production ? Validators.required : null],
      postcode: ["", this.env.production ? Validators.required : null],
    });
    this.detailGroup = this.fb.group({
      musictype: ["", this.env.production ? Validators.required : null],
      membertype: ["", this.env.production ? Validators.required : null],
      startyear: ["", this.env.production ? Validators.required : null],
      bio: ["", this.env.production ? Validators.required : null],
      favouriteparty: [""],
      partyfrequency: ["", this.env.production ? Validators.required : null],
      favouritefestival: [""],
      festivalfrequency: ["", this.env.production ? Validators.required : null],
      facebookUrl: [""],
      soundcloudUrl: [""],
      websiteUrl: [""]
    });
    this.opinionGroup = this.fb.group({
      psystatus: ["", Validators.required],
      reason: ["", Validators.required]
    });
  }

  musicGenreFilter(value) {
    if (value.name) {
      return this.musicGenres.filter(genre => genre.name.toLowerCase().includes(value.name.toLowerCase()));
    }
    else if (value)
      return this.musicGenres.filter(genre => genre.name.toLowerCase().includes(value.toLowerCase()));
  }

 
   public valueNormalizer = (text$: Observable<string>) => text$.pipe(map((text: string) => {
    let selectedData: Array<any> = this.detailGroup.get("musictype").value;
    
    if(selectedData && Array.isArray(selectedData) && selectedData.length > 0) {
      const matchingValue: any = selectedData.find((item: any) => {
          return item.name.toLowerCase() === text.toLowerCase();
      });

      if (matchingValue) {
          return null; 
      }
    }
    const matchingItem: any = this.data.find((item: any) => {
        return item.name.toLowerCase() === text.toLowerCase();
    });
    if (matchingItem) {
        return matchingItem;
    } else {
        return {
            _id: Math.random(), 
            name: text
        };
    }
  }));

}
