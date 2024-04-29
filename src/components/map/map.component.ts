import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

declare var google: any;
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @ViewChild('map', { static: false }) mapElementRef!: ElementRef;
  center = { lat: -33.9249, lng: 18.4241 };
  map: any;
  marker: any;
  mapListener: any;
  intersectionObserver: any;
  mapLoaded = false;
  // center: any;
  constructor( ) { }

  ngOnInit() {
    this.loadMap();
  }

  ngAfterViewInit() {
    this.intersectionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if(entry.isIntersecting) {
          entry.target.classList.add('drop');
          this.intersectionObserver.unobserve(entry.target);
        }
      }
    })

  }

  async loadMap() {
    const mapLibrary = await google.maps.importLibrary("maps");
    const Map = mapLibrary.Map;
    const mapEl = this.mapElementRef.nativeElement;
    const location = new google.maps.LatLng(this.center.lat, this.center.lng);

    this.map = new Map(mapEl, {
      center: location,
      zoom: 16,
      scaleControl: true,
      disableDefaultUI: true,
      gestureHandling: "cooperative",
      mapId: "crunch-time-delivery-a0187",
    });

    // this.addMarker(location);
    this.mapLoaded = true;

    if (this.mapLoaded) {
      this.searchLocation();
    } else {
      console.warn("Map is not loaded yet.");
    }
  }

  searchLocation() {
    const map = this.map; // Retrieve the existing map instance
  
    if (!map) {
      console.error("Map instance not found.");
      return;
    }
  
    const input = document.getElementById("pac-input") as HTMLInputElement;
    const card = document.getElementById("pac-card") as HTMLElement;
  
    const options = {
      fields: ["formatted_address", "geometry", "name"],
      strictBounds: false,
    };
  
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);
    const autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.bindTo("bounds", map);
    const infowindow = new google.maps.InfoWindow();

    // The google.maps.Marker is deprecated
    const marker = new google.maps.Marker({
      map,
      anchorPoint: new google.maps.Point(0, -29),
    });

    // I need to use this for the marker in this function // I'll do it later not in the mood rn
    // const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

    // this.marker = new AdvancedMarkerElement({
    //   map: this.map,
    //   position: location,
    //   gmpDraggable: true,
    //   content: markerPin.element,
    // });
  
    autocomplete.addListener("place_changed", () => {
      infowindow.close();
      marker.setVisible(false);
  
      const place = autocomplete.getPlace();
  
      // if (!place.geometry || !place.geometry.location) {
      //   window.alert("No details available for input: '" + place.name + "'");
      //   return;
      // }
  
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }
  
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);
    });
  }
  
  

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.map.setCenter({ lat, lng });
          this.addMarker({ lat, lng });
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  async addMarker(location: any) {
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
    
    this.getCurrentLocation;
    const markerPin = new PinElement({
      background: "#ffc800ea",
      borderColor: "#FF0000"
    })

    this.marker = new AdvancedMarkerElement({
      map: this.map,
      position: location,
      gmpDraggable: true,
      content: markerPin.element,
    });

  }

  mapClicked() {
    this.mapListener = google.maps.event.addListener(this.map, "click", (event: any) => {
      this.addMarker(event.latLng)
    });
  }

  public clearMarker(): void {
    this.marker.label = '';
  }


  
  // TODO: Implement methods for geocoding and reverse geocoding to retrieve and display addresses based on coordinates.
  // TODO: Implement a method to save the selected location and handle place selection.
  // TODO: Implement methods to display toasts and clear marker labels.
  // TODO: Implement a method to handle emitted coordinates and set them as the current location.
  // TODO: Define lifecycle hooks such as ngOnInit and ngOnViewEnter if needed.
  // TODO: Further configure the map as required for the application.

}
