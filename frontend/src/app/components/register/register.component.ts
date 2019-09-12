import { Artist } from './../../models/member.model';
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
import moment from 'moment';
import dropdowns from '../../../assets/static-data/dropdowns.json';
import { Moment } from "moment";
import { TokenService } from "../../services/token.service";
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { environment } from '../../../environments/environment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ArtistDialogComponent } from "./artist-dialog/artist-dialog.component";

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

const urlRegex = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

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
  filteredReferers: Observable<any[]>;
  filteredMusicGenres: Observable<string[]>;
  filteredArtists: Observable<string[]>;
  startyearChoices: Array<string>;
  yearStart: Date;
  minDate: Date;
  maxDate: Date;
  avatarUrl: string = null;
  newMode: boolean = true;
  user: SocialUser;
  socialid: string;
  member: Member = {};
  members: Array<Member> = [];
  musicGenres: any;
  artists: any;
  selectedArtists: any = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  env = environment;
  musicTypeData: Array<any>;
  artistData: Array<any>;
  dropdownData;

  @ViewChild("musicGenreList", { static: false }) musicGenreList;
  @ViewChild("artistList", { static: false }) artistList;


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private memberService: MemberService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private socialAuthService: AuthService,
    private tokenService: TokenService,
    public dialog: MatDialog
    // public dialogRef: MatDialogRef<ArtistDialogComponent>
  ) {
    this.newMode = this.activatedRoute.snapshot.paramMap.get("mode") === "new" ? true : false;
    this.musicGenres = this.activatedRoute.snapshot.data["data"]["static"][0];
    console.log(this.musicGenres);
    this.artists = this.activatedRoute.snapshot.data["data"]["static"][1];
    this.members = this.activatedRoute.snapshot.data["data"]["members"];
    this.musicTypeData = this.musicGenres.slice();
    this.artistData = this.artists.slice();
    this.dropdownData = dropdowns;
    this.countries = this.memberService.getAllCountries();
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
        tap((value) => { this.musicGenreList.loading = true }),
        map((data) => data.filter(contains(value)))
      ))
    )
      .subscribe(x => {
        this.musicTypeData = x;
        this.musicGenreList.loading = false;
      });
    this.artistList.filterChange.asObservable().pipe(
      switchMap(value => from([this.artists]).pipe(
        tap((value) => { this.artistList.loading = true }),
        map((data) => data.filter(contains(value)))
      ))
    )
      .subscribe(x => {
        this.artistData = x;
        this.artistList.loading = false;
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
    this.member = this.memberService.getUser();
    if (this.member) {
      console.log("loading member details to", this.member);
      this.socialid = this.member.socialid;
      this.basicInfoGroup.get("uname").setValue(this.member.uname);
      this.basicInfoGroup.get("fname").setValue(this.member.fname);
      this.basicInfoGroup.get("lname").setValue(this.member.lname);
      this.basicInfoGroup.get("email").setValue(this.member.email);
      if (this.member.referer)
        this.basicInfoGroup.get("referer").setValue(this.member.referer);
      this.genderSelected = this.member.gender;
      this.basicInfoGroup.get("postcode").setValue(this.member.postcode);
      this.basicInfoGroup.get("origin").setValue(this.countries.filter(el => el.alpha3Code === this.member.origin));
      this.basicInfoGroup.get("location").setValue(this.countries.filter(el => el.alpha3Code === this.member.location));
      this.basicInfoGroup.get("birthyear").setValue(moment().set("year", this.member.birthyear));
      this.detailGroup.get("membertype").setValue(this.member.membertype);
      this.detailGroup.get("musictype").setValue(this.member.musictype);
      this.detailGroup.get("startyear").setValue(moment().set("year", this.member.startyear));
      this.detailGroup.get("bio").setValue(this.member.bio);
      this.detailGroup.get("facebookUrl").setValue(this.member.facebookUrl.substring(this.member.facebookUrl.lastIndexOf('/') + 1, this.member.facebookUrl.length));
      this.detailGroup.get("soundcloudUrl").setValue(this.member.soundcloudUrl.substring(this.member.soundcloudUrl.lastIndexOf('/') + 1, this.member.soundcloudUrl.length));
      this.detailGroup.get("websiteUrl").setValue(this.member.websiteUrl.substring(this.member.websiteUrl.indexOf('/') + 2, this.member.websiteUrl.length));
      this.opinionGroup.get("psystatus").setValue(this.member.psystatus);
      this.opinionGroup.get("reason").setValue(this.member.reason);
      this.opinionGroup.get("favouriteparty").setValue(this.member.favouriteparty);
      this.opinionGroup.get("partyfrequency").setValue(this.member.partyfrequency);
      this.opinionGroup.get("festivalfrequency").setValue(this.member.festivalfrequency);
      this.opinionGroup.get("favouritefestival").setValue(this.member.favouritefestival);
      this.opinionGroup.get("favouriteartists").setValue(this.member.favouriteartists);


    }
  }

  setLocation(event) {
    this.basicInfoGroup.get("postcode").setValue("");
  }

  setReferer(event) {
    // this.basicInfoGroup.get("referer").setValue(event);
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
    this.filteredReferers = this.basicInfoGroup.get("referer").valueChanges.pipe(
      startWith(""),
      map(value => (value ? this.refererFilter(value) : this.members.slice()))
    );
  }

  refererFilter(value): any[] {
    return this.members.filter(member =>
      member._id == value._id);
  }


  countryFilter(value): any[] {
    if (value) {
      if (value.alpha3Code) {
        return this.countries.filter(option =>
          option.alpha3Code.toLowerCase().includes(value.alpha3Code.toLowerCase())
        );
      } else {
        return this.countries.filter(option =>
          option.name.toLowerCase().includes(value.toLowerCase())
        );
      }
    }
  }
  displayRefererFn(member) {
    return member.uname;
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
    // this.createNewStaticDataTypes();
    let updateMember: Member = {
      _id: this.member._id,
      uname: this.basicInfoGroup.get("uname").value,
      fname: this.basicInfoGroup.get("fname").value,
      lname: this.basicInfoGroup.get("lname").value,
      referer: this.basicInfoGroup.get("referer").value,
      socialid: this.socialid,
      gender: this.genderSelected,
      birthyear: this.basicInfoGroup.get("birthyear").value.year(),
      origin: this.getalpha3Code("origin"),
      location: this.getalpha3Code("location"),
      postcode: this.basicInfoGroup.get("postcode").value,
      email: this.basicInfoGroup.get("email").value,
      lat: this.latitude,
      long: this.longitude,
      membertype: this.detailGroup.get("membertype").value,

      musictype: this.detailGroup.get("musictype").value,
      startyear: this.detailGroup.get("startyear").value.year(),
      bio: this.detailGroup.get("bio").value,
      websiteUrl: "http://" + this.detailGroup.get("websiteUrl").value,
      facebookUrl: "http://www.facebook.com/" + this.detailGroup.get("facebookUrl").value,
      soundcloudUrl: "https://www.soundcloud.com/" + this.detailGroup.get("soundcloudUrl").value,
      psystatus: this.opinionGroup.get("psystatus").value,
      favouriteartists: this.opinionGroup.get("favouriteartists").value,
      reason: this.opinionGroup.get("reason").value,
      partyfrequency: this.opinionGroup.get("partyfrequency").value,
      favouriteparty: this.opinionGroup.get("favouriteparty").value,
      festivalfrequency: this.opinionGroup.get("festivalfrequency").value,
      favouritefestival: this.opinionGroup.get("favouritefestival").value,
      avatarUrl: this.avatarUrl
    };
    console.log('memcheck', this.member, this.memberService.getUserId())
    if (this.memberService.getUser() && this.memberService.getUserId()) {
      console.log("updating ", updateMember);
      this.memberService.updateMember(this.memberService.getUserId(), updateMember).subscribe(result => {
        console.log('returned member', updateMember)
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
        this.memberService.saveMemberToLocalStorage(member);
        let snackBarRef = this.snackBar.open("Successfully created", "OK", {
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

  // createNewStaticDataTypes() {

  //   let music =  this.detailGroup.get("musictype").value;
  //   music.array.forEach(element => {

  //   });

  //   return this.addNewStaticData({ name: text, type: type }).subscribe((value : any) => {
  //     console.log(value);
  //     if (type == 'musictype') {
  //       this.musicTypeData.push({'text' : value.name, '_id' : value.id });
  //     }
  //     return value;
  //   })
  // }

  getalpha3Code(field: string) {
    let location = this.basicInfoGroup.get(field).value;
    let locationCode;
    if (Array.isArray(location)) {
      locationCode = location[0].alpha3Code;
    } else locationCode = location.alpha3Code;
    return locationCode;
  }

  createForm() {
    this.basicInfoGroup = this.fb.group({
      uname: ["", this.env.production ? Validators.required : null],
      fname: ["", this.env.production ? Validators.required : null],
      lname: ["", this.env.production ? Validators.required : null],
      gender: ["", this.env.production ? Validators.required : null],
      email: ["", this.env.production ? [Validators.required, Validators.email] : null],
      referer: [""],
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
      soundcloudUrl: [""],
      facebookUrl: [""],
      websiteUrl: ["", Validators.pattern(urlRegex)],
    });
    this.opinionGroup = this.fb.group({
      favouriteparty: [""],
      favouriteartists: [""],
      partyfrequency: ["", this.env.production ? Validators.required : null],
      favouritefestival: [""],
      festivalfrequency: ["", this.env.production ? Validators.required : null],
      psystatus: ["", Validators.required],
      reason: ["", Validators.required]
    });
  }

  artistFilter(value) {
    if (value.name) {
      return this.artists.filter(artist => artist.name.toLowerCase().includes(value.name.toLowerCase()));
    }
    else if (value)
      return this.artists.filter(artist => artist.name.toLowerCase().includes(value.toLowerCase()));
  }

  musicGenreFilter(value) {
    if (value.name) {
      return this.musicGenres.filter(genre => genre.name.toLowerCase().includes(value.name.toLowerCase()));
    }
    else if (value)
      return this.musicGenres.filter(genre => genre.name.toLowerCase().includes(value.toLowerCase()));
  }


  public artistValueNormalizer = (text$: Observable<string>) => text$.pipe(map((text: string) => {
    return this.getValueForNormalizer(this.opinionGroup.get("favouriteartists").value, text, this.artistData)
  }));

  public musictypeValueNormalizer = (text$: Observable<string>) => text$.pipe(map((text: string) => {
    return this.getValueForNormalizer(this.detailGroup.get("musictype").value, text, this.musicTypeData)
    // .subscribe((res) => {
    //   this.musicGenres.push(value);
    //   return value;
    // })
    // console.log('val', value)
  }));

  getValueForNormalizer(selectedData: Array<any>, text: string, data: Array<any>) {
    if (selectedData && Array.isArray(selectedData) && selectedData.length > 0) {
      const matchingValue: any = selectedData.find((item: any) => {
        return item.name.toLowerCase() === text.toLowerCase();
      });

      if (matchingValue) {
        return null;
      }
    }
    const matchingItem: any = data.find((item: any) => {
      return item.name.toLowerCase() === text.toLowerCase();
    });
    if (matchingItem) {
      return matchingItem;
    } else {
      return {
        _id: Math.random(),
        name: text
      }
    }
  }

  // addNewStaticData(value) {
  //   return this.memberService.addStaticData(value);
  // }
  openNewArtistDialog() {
    const dialogRef = this.dialog.open(ArtistDialogComponent, {
      width: '300px',
      height: '400px',
    });

    dialogRef.afterClosed().subscribe((updateArtist: Artist) => {
      console.log('The dialog was closed', updateArtist);
      if(!updateArtist) return;
        this.memberService.addStaticData({type : 'artist','value': updateArtist}).subscribe(res => {
          console.log(res)
          this.artists.push(res);
          this.artistData.push(res);
          this.selectedArtists.push(res);
          // this.matSnackBar.open("Video Link created!", "OK");
          // this.router.navigate(["/nav/watch"]);
        });
    });
  }
}
