import {
  Component,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  SimpleChange
} from "@angular/core";
import { Member } from "src/app/models/member.model";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.css"]
})
export class MapComponent {
  @Input() postcode: string;
  @Input() countryCode;

  @ViewChild("gmap", { static: true }) gmapElement: any;
  map: google.maps.Map;

  @Output() latLng: EventEmitter<Object> = new EventEmitter();

  mapVisible: boolean = false;

  constructor(private toastrService: ToastrService) {}

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
    const postcodeChange: SimpleChange = changes.postcode;
    const countryCodeChange: SimpleChange = changes.countryCode;
    let countryCodeUpdate;
    if (countryCodeChange) {
      if (Array.isArray(countryCodeChange.currentValue)) {
        if (countryCodeChange.currentValue.length > 0)
          countryCodeUpdate = countryCodeChange.currentValue[0].alpha3Code;
      } else {
        if (countryCodeChange.currentValue) countryCodeUpdate = countryCodeChange.currentValue;
      }
    } else
      countryCodeUpdate = Array.isArray(this.countryCode)
        ? this.countryCode[0].alpha3Code
        : this.countryCode.alpha3Code;
    if (postcodeChange && postcodeChange.currentValue !== "") {
      this.geocode(postcodeChange.currentValue, countryCodeUpdate);
    } else if (countryCodeChange && countryCodeChange.currentValue !== "") {
      this.geocode(null, countryCodeUpdate);
    }
  }

  geocode(postcode, countryCode) {
    let geocoder = new google.maps.Geocoder();
    let payload = postcode != null ? { address: postcode, region: countryCode } : { address: countryCode };
    geocoder.geocode(payload, (results, status) => {
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
        this.toastrService.error("GoogleMaps cannot find your address!", "Error", {timeOut: 2000});
      }
    });
  }

  generateInfoWindow(el: Member, marker: google.maps.Marker) {
    var infowindow = new google.maps.InfoWindow({
      content: el.fname + " " + el.lname + " thinks psytrance is " + el.psystatus
    });
    marker.addListener("mouseover", () => {
      infowindow.open(this.map, marker);
    });
    marker.addListener("mouseout", () => {
      infowindow.close();
    });
  }
}
