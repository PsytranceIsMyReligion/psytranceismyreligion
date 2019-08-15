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

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.css"]
})
export class MapComponent implements OnInit {
  @Input() postcode: string;

  @ViewChild("gmap", { static: true }) gmapElement: any;
  map: google.maps.Map;

  @Output() latLng: EventEmitter<Object> = new EventEmitter();

  mapVisible: boolean = false;

  constructor() {}

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    let mapProp = {
      zoom: 0,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.map.setZoom(15);
  }

  ngOnChanges(changes: SimpleChanges) {
    const postcode: SimpleChange = changes.postcode;
    if (postcode && postcode.currentValue !== "") {
      this.geocode(postcode.currentValue);
    }
  }

  geocode(postcode) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: postcode }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
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
        this.gmapElement.nativeElement.hidden = false;
      }
    });
  }
}
