import { MemberSelectorComponent } from "./../home/member-selector/member-selector.component";
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
  allCountries = [];
  allFestivals = [];
  allArtists = [];
  constructor(
    private memberService: MemberService,
    private activatedRoute: ActivatedRoute
  ) {
    this.members = this.memberService.members$.getValue();
    this.artists = this.activatedRoute.snapshot.data["data"].artists;
    this.festivals = this.activatedRoute.snapshot.data["data"].festivals;
    this.musicGenres = this.activatedRoute.snapshot.data["data"].musicGenres;
    console.log("resolved", this.artists, this.festivals, this.musicGenres);
  }

  ngOnInit() {
    this.members.forEach(
      m => (this.allCountries = this.allCountries.concat(m.origin))
    );
    this.members.forEach(m => {
      this.allFestivals = this.allFestivals.concat(m.favouritefestivals);
    });
    this.members.forEach(m => {
      this.allArtists = this.allArtists.concat(m.favouriteartists);
    });
    this.buildCharts();

    console.log("all countries", this.allCountries);
  }

  buildCharts() {
    this.chartSeries$.next({
      genderSeries: this.buildGender(),
      countrySeries: this.buildCountrySeries(),
      ageSeries: this.buildAgeSeries(),
      artistSeries: this.buildArtistSeries(),
      kudosSeries: this.buildKudosSeries(),
      festivalSeries: this.buildFestivalSeries(),
      artistByOriginSeries: this.buildArtistByOriginSeries(),
      festivalsByLocationSeries: this.buildFestivalsByLocationSeries(),
      psyStatusSeries: this.buildPsyStatusSeries()
    });
    console.log("chart series data ", this.chartSeries$.getValue());
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
          this.calcPercent(this.members.filter(m => m.gender == "F").length)
        ]
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
    return this.countOfStaticData(this.allFestivals);
  }

  buildFestivalsByLocationSeries() {
    let festivalCountries = [];
    this.festivals.forEach(
      el => (festivalCountries = festivalCountries.concat(el.location))
    );
    let festivalsByLocation = groupBy(this.festivals, [{ field: "location" }]);
    let festivalCount = this.countOf(festivalCountries);
    festivalCount.forEach((dat, index, array) => {
      let clone = _.clone(festivalsByLocation);
      clone = _.filter(clone, el => {
        return el["value"] == dat.name;
      });
      array[index].festivals = clone[0].items;
    });
    festivalCount.forEach(el => {
      el.festivals = el.festivals.map(festival => festival.name);
    });
    return {
      data: festivalCount
    };
  }

  buildCountrySeries() {
    return this.countOf(this.allCountries, "name");
  }

  buildArtistByOriginSeries() {
    let artistByLocation: any = groupBy(this.artists, [{ field: "origin" }]);
    let artistCountries = [];
    this.artists.forEach(
      el => (artistCountries = artistCountries.concat(el.origin))
    );
    let artistCount = this.countOf(artistCountries);
    artistCount.forEach((dat, index, array) => {
      let filtered = _.filter(artistByLocation, el => {
        let originData = artistByLocation.filter(el => {
          let res = el.items.find(el => {
            return el.origin == dat.name;
          });
          return res != null;
        });
        return el.value == originData[0].value;
      });
      array[index].artists = filtered[0]["items"];
    });
    artistCount.forEach(el => {
      el.artists = el.artists.map(artist => artist.name);
    });
    return artistCount;
  }

  buildPsyStatusSeries() {
    let psystatus = [];
    this.members.forEach(el => (psystatus = psystatus.concat(el.psystatus)));
    console.log("stat", psystatus);
    return this.countOf(psystatus);
  }

  private countOf(items: any[], field?) {
    console.log("countOf", items, field);
    return items.reduce((acc, cur) => {
      // console.log(acc, cur);
      let item;
      if (field) item = acc.filter(el => el[field] == cur[field]);
      else item = acc.filter(el => el.name == cur);

      if (item.length == 0) {
        acc.push({ name: cur, count: 1 });
      } else {
        let index;
        if (field) index = _.findIndex(acc, o => o == cur[field]);
        else index = _.findIndex(acc, o => o.name == cur);
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
