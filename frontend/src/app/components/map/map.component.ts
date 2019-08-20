import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  SimpleChange
} from "@angular/core";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.css"]
})
export class MapComponent implements OnInit {
  @Input() postcode: string;
  @Input() countryCode;

  @ViewChild("gmap", { static: true }) gmapElement: any;
  map: google.maps.Map;

  @Output() latLng: EventEmitter<Object> = new EventEmitter();

  mapVisible: boolean = false;

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {
    // this.initMap();
  }

  initMap() {
    let mapProp = {
      zoom: 15,
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

  ngOnChanges(changes: SimpleChanges) {
    console.log("ngChanges", changes);
    const postcodeChange: SimpleChange = changes.postcode;
    const countryCodeChange: SimpleChange = changes.countryCode;
    if (postcodeChange && postcodeChange.currentValue !== "" && this.countryCode) {
      this.geocode(postcodeChange.currentValue, this.countryCode.alpha2Code);
    } else if (countryCodeChange && countryCodeChange.currentValue !== "") {
      this.geocode(null, countryCodeChange.currentValue.alpha2Code);
    }
  }

  geocode(postcode, countryCode) {
    console.log("postcode", postcode, "countryCode", countryCode);
    var geocoder = new google.maps.Geocoder();
    var payload =
      postcode != null ? { address: postcode, region: countryCode } : { address: countryCode };
    geocoder.geocode(payload, (results, status) => {
      // console.log("geoCode status ", status);
      if (status == google.maps.GeocoderStatus.OK) {
        this.initMap();
        this.latLng.emit({
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        });
        let location = new google.maps.LatLng(
          results[0].geometry.location.lat(),
          results[0].geometry.location.lng()
        );
        this.map.setCenter(
          new google.maps.LatLng(
            results[0].geometry.location.lat(),
            results[0].geometry.location.lng()
          )
        );
        this.map.setZoom(15);
        let marker = new google.maps.Marker({
          position: location,
          map: this.map
        });
        this.mapVisible = true;
        this.gmapElement.nativeElement.hidden = false;
      } else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
        let snackBarRef = this.snackBar.open("GoogleMaps cannot find your address!", "OK", {
          duration: 2000
        });
      }
    });
  }
}
