import { Member, StaticData } from "src/app/models/member.model";
import { MemberService } from "./../../services/member.service";
import { Component, OnInit } from "@angular/core";
import { of, BehaviorSubject } from "rxjs";
import moment from "moment";
import { ActivatedRoute } from "@angular/router";
import { groupBy, GroupResult } from "@progress/kendo-data-query";
import _ from "lodash";
@Component({
  selector: "app-stats",
  templateUrl: "./stats.component.html",
  styleUrls: ["./stats.component.css"]
})
export class StatsComponent implements OnInit {
  members: Member[];
  chartSeries$: BehaviorSubject<any> = new BehaviorSubject([]);
  staticData;
  categories = ["Male", "Female"];
  musicGenres: Array<StaticData> = [];
  festivals: Array<StaticData> = [];
  artists: Array<StaticData> = [];
  constructor(private memberService: MemberService, private activatedRoute: ActivatedRoute) {
    this.members = this.memberService.members$.getValue();
    this.artists = this.activatedRoute.snapshot.data["data"].artists;
    this.festivals = this.activatedRoute.snapshot.data["data"].festivals;
    this.musicGenres = this.activatedRoute.snapshot.data["data"].musicGenres;
    this.buildCharts();
  }

  ngOnInit() {}

  buildCharts() {
    console.log("built", {
      genderSeries: this.buildGender(),
      countrySeries: this.buildCountrySeries(),
      ageSeries: this.buildAgeSeries(),
      artistSeries: this.buildArtistSeries(),
      kudosSeries: this.buildKudosSeries()
    });
    this.chartSeries$.next({
      genderSeries: this.buildGender(),
      countrySeries: this.buildCountrySeries(),
      ageSeries: this.buildAgeSeries(),
      artistSeries: this.buildArtistSeries(),
      kudosSeries: this.buildKudosSeries(),
      festivalSeries: this.buildFestivalSeries()
    });
  }

  buildGender() {
    return [
      {
        name: "Male",
        data: [this.calcPercent(this.members.filter(m => m.gender == "M").length)]
      },
      {
        name: "Female",
        data: [this.calcPercent(this.members.filter(m => m.gender == "F").length)]
      }
    ];
  }

  buildKudosSeries() {
    return this.members.map(m => {
      return {
        name: m.uname,
        kudos: m.karmicKudos
      };
    });
  }
  buildArtistSeries() {
    let allArtists = [];
    this.members.forEach(mem => {
      allArtists = allArtists.concat(mem.favouriteartists);
    });
    return this.countOfStaticData(allArtists);
  }

  buildFestivalSeries() {
    let allFestivals = [];
    this.members.forEach(mem => {
      allFestivals = allFestivals.concat(mem.favouritefestivals);
    });
    return this.countOfStaticData(allFestivals);
  }

  buildCountrySeries() {
    let allCountries = [];
    this.members.forEach(m => (allCountries = allCountries.concat(m.location)));
    console.log(allCountries);
    return this.countOf(allCountries);
  }

  private countOf(items: any[]) {
    return items.reduce((acc, cur) => {
      let item = acc.filter(el => el.name == cur.name);
      if (item.length == 0) {
        acc.push({ name: cur, count: 1 });
      } else {
        let index = _.findIndex(acc, o => o == cur.name);
        acc[index] = { name: cur, count: acc[index].count + 1 };
      }
      return acc;
    }, []);
  }

  private countOfStaticData(items: any[]) {
    return items.reduce((acc, cur) => {
      let item = acc.filter(el => el.name == cur.name);
      if (item.length == 0) {
        acc.push({ name: cur.name, count: 1 });
      } else {
        let index = _.findIndex(acc, o => o.name == cur.name);
        acc[index] = { name: cur.name, count: acc[index].count + 1 };
      }
      return acc;
    }, []);
  }

  buildAgeSeries() {
    let years = this.members.map(m => m.birthyear);
    return years.map(y => {
      return {
        yearDisplay: y,
        year: moment()
          .set("year", y)
          .set("month", 1)
          .set("day", 1)
          .toISOString(),
        count: this.members.map(m => m.birthyear == y).length
      };
    });
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
