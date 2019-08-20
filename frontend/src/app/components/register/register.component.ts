import { Component, OnInit } from "@angular/core";
import { Member } from "../../models/member.model";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { MemberService } from "../../services/member.service";
import { MatSnackBar } from "@angular/material";
import { map, startWith, tap } from "rxjs/operators";
import { MatDatepicker } from "@angular/material/datepicker";
import { Observable } from "rxjs";
import { AuthService, SocialUser } from "angularx-social-login";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";

import * as moment from "moment";
import { Moment } from "moment";
import { Route } from "@angular/compiler/src/core";

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
  // originCtrl: FormControl = new FormControl();
  filteredCountries: Observable<any[]>;
  startyearChoices: Array<string>;
  yearStart: Date;
  minDate: Date;
  maxDate: Date;
  avatarUrl: string = null;
  newMode: boolean = true;
  user: SocialUser;
  socialid: string;
  member: Member = {};

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private memberService: MemberService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private socialAuthService: AuthService
  ) {
    this.newMode = this.activatedRoute.snapshot.paramMap.get("mode") === "new" ? true : false;
    this.countries = this.activatedRoute.snapshot.data["data"];
    console.log("newMode", this.newMode);
  }

  ngOnInit() {
    this.createForm();
    this.loadCountries();
    this.loadSocialUser();
    this.yearStart = moment()
      .add(-18, "year")
      .toDate();
    this.maxDate = moment().toDate();
    this.minDate = moment()
      .add(-90, "year")
      .toDate();
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
      console.log("found member", this.member);
      this.socialid = this.member.socialid;
      this.basicInfoGroup.get("fname").setValue(this.member.fname);
      this.basicInfoGroup.get("lname").setValue(this.member.lname);
      this.basicInfoGroup.get("email").setValue(this.member.email);
      this.genderSelected = this.member.gender;
      this.basicInfoGroup.get("postcode").setValue(this.member.postcode);
      let ori = this.countries.filter(el => el.alpha2Code === this.member.origin);
      this.basicInfoGroup.get("origin").setValue(ori);
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
      this.detailGroup.get("facebookurl").setValue(this.member.facebookurl);
      this.detailGroup.get("soundcloudurl").setValue(this.member.soundcloudurl);
      this.detailGroup.get("websiteurl").setValue(this.member.websiteurl);
    }
  }

  setOrigin(event) {
    this.basicInfoGroup.get("postcode").setValue("");
  }

  loadCountries() {
    console.log("loadCountres");
    this.filteredCountries = this.basicInfoGroup.get("origin").valueChanges.pipe(
      startWith(""),
      map(value => (value ? this._filter(value) : this.countries.slice()))
    );
  }

  _filter(value): any[] {
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

  public findInvalidControls() {
    const invalid = [];
    const controls = this.basicInfoGroup.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log(invalid);
  }

  displayFn(country) {
    if (Array.isArray(country))
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
    let origin = this.basicInfoGroup.get("origin").value;
    console.log("origin set ", origin[0].alpha2Code);
    let updateMember: Member = {
      fname: this.basicInfoGroup.get("fname").value,
      lname: this.basicInfoGroup.get("lname").value,
      socialid: this.socialid,
      gender: this.genderSelected,
      birthyear: this.basicInfoGroup.get("birthyear").value.year(),
      origin: origin[0].alpha2Code,
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
      psystatus: this.opinionGroup.get("psystatus").value,
      reason: this.opinionGroup.get("reason").value
    };
    if (this.member && this.member._id) {
      console.log("updating ", updateMember);
      this.memberService.updateMember(this.member._id, updateMember).subscribe(member => {
        sessionStorage.setItem("member", JSON.stringify(member));
        let snackBarRef = this.snackBar.open("Successfully updated", "OK", {
          duration: 2000
        });
        // snackBarRef.afterDismissed().subscribe(() => {
        // this.router.navigate(["/nav/list"]);
        // });
      });
    } else {
      console.log("creating ", updateMember);
      this.memberService.createMember(updateMember).subscribe(member => {
        sessionStorage.setItem("member", JSON.stringify(member));
        let snackBarRef = this.snackBar.open("Successfully updated", "OK", {
          duration: 2000
        });
        // snackBarRef.afterDismissed().subscribe(() => {
        // this.router.navigate(["/nav/list"]);
        // });
      });
    }
    console.log("updated");
  }

  createForm() {
    this.basicInfoGroup = this.fb.group({
      fname: ["", Validators.required],
      lname: ["", Validators.required],
      gender: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      origin: ["", Validators.required],
      birthyear: ["", Validators.required],
      postcode: ["", Validators.required]
    });
    this.detailGroup = this.fb.group({
      musictype: ["", Validators.required],
      membertype: ["", Validators.required],
      startyear: ["", Validators.required],
      bio: [""],
      favouriteparty: [""],
      partyfrequency: [""],
      favouritefestival: [""],
      festivalfrequency: [""],
      facebookurl: [""],
      soundcloudurl: [""],
      websiteurl: [""]
    });
    this.opinionGroup = this.fb.group({
      psystatus: ["", Validators.required],
      reason: ["", Validators.required]
    });
  }
}
