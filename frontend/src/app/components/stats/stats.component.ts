import { Artist } from './../../models/member.model';
import { Member } from "src/app/models/member.model";
import { MemberService } from "./../../services/member.service";
import { Component, OnInit } from "@angular/core";
import { of, BehaviorSubject } from "rxjs";
import moment from "moment";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: "app-stats",
  templateUrl: "./stats.component.html",
  styleUrls: ["./stats.component.css"]
})
export class StatsComponent implements OnInit {
  members: Member[];
  chartSeries$: BehaviorSubject<any> = new BehaviorSubject([]);
  staticData
  categories = ["Male", "Female"];
  musicGenres : Array<any> = [];
  artists : Array<Artist> = [];
  constructor(private memberService: MemberService, private activatedRoute: ActivatedRoute
    ) {
    this.musicGenres = this.activatedRoute.snapshot.data["data"]["static"][0];
    this.artists = this.activatedRoute.snapshot.data["data"]["static"][1];
    this.members = this.activatedRoute.snapshot.data["data"]["members"];
    this.buildCharts();
  }

  ngOnInit() {}

  buildCharts() {
    console.log({
      genderSeries: this.buildGender(),
      countrySeries: this.buildCountry(),
      ageSeries: this.buildAge(),
      artistSeries: this.buildArtists(),
      kudosSeries: this.buildKudosSeries()
    });
    this.chartSeries$.next({
      genderSeries: this.buildGender(),
      country: this.buildCountry(),
      age: this.buildAge(),
      artists: this.buildArtists(),
      kudosSeries: this.buildKudosSeries()
    });
  }

  buildGender() {
    return [
      {
        name: "Male",
        data: [
          this.calcPercent(this.members.filter(m => m.gender == "M").length)
        ]
      },
      {
        name: "Female",
        data: [
          this.calcPercent(this.members.filter(m => m.gender == "M").length)
        ]
      }
    ];
  }

  buildKudosSeries() {
    return this.members.map(m => {
      return {
        name: m.uname,
        data: m.karmicKudos
      };
    });
  }
  buildArtists() {
    // let artists = this.memberService.getStaticData()
    // console.log(this.artists, this.artists.forEach((a:Artist) => {
    //   return {
    //     name : a.name,
    //     // count : this.countUnique
    //   }

    // }));

    return this.artists.forEach((a:Artist) => {
      return {
        name : a.name,
        // count : this.countUnique(a.name)
      }

    });
  }
  buildAge() {

      let years = this.members.map(m => m.birthyear);
      years.map(y => {
        return {
          year :  moment()
          .set("year", y).set("month", 1).set("day",1)
          .toDate(),
          count : this.members.map(m => m.birthyear == y)
        }
      })

      // return this.members.map(m => {
      // // name: this.members.map(m => m.uname),
      // return {

      //   dob : moment()
      //       .set("year", m.birthyear).set("month", 1).set("day",1)
      //       .toDate(),
      //   name: m.uname,
      // }
      // data: this.members.map(m =>
      //   moment()
      //     .set("year", m.birthyear).set("month", 1).set("day",1)
      //     .toDate()
      // )
    // });
  }
  buildCountry() {
    let countries = this.members.map(m => m.location);
    // countries.map(c => {
    //   return c.le
    // })
  }

  calcPercent(input: number) {
    return Math.round((input / this.members.length) * 100);
  }

  countUnique(str) {
    return str.split(" ").reduce(function(count, word) {
      count[word] = count.hasOwnProperty(word) ? count[word] + 1 : 1;

      return count;
    }, {});
  }
}
