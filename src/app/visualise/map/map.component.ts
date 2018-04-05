/**
 * Created by cmathew on 22.11.16.
 */
import {MapService} from "./map.service"
import {
  Component, AfterViewInit, ElementRef, Input, ViewChild, OnDestroy, Renderer2, NgZone,
  OnChanges, ChangeDetectionStrategy, ChangeDetectorRef
} from "@angular/core"
import {Map} from "leaflet"
import {UIStateStore} from "../../shared/ui.state.store"
import {Provenance, VisTab} from "../../analyse/flow.model"
import LatLng = L.LatLng
import Marker = L.Marker
import {Observable} from "rxjs/Rx"


@Component({
  selector: "map",
  templateUrl: "partials/visualise/map.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements AfterViewInit,  OnDestroy {

  @ViewChild("map") mapElementRef: ElementRef

  private el:HTMLElement
  private mapEl:HTMLElement


  public map: Map
  private markers: Array<Marker> = []
  private isMapInitialised: boolean = false

  private baseUrl: string = window.location.protocol + "//" +window.location.host + "/"

  private markerIconUrl: string = this.baseUrl + "assets/lib/leaflet/dist/images/marker-icon.png"
  private markerShadowUrl: string = this.baseUrl + "assets/lib/leaflet/dist/images/marker-shadow.png"


  constructor(private mapService: MapService,
              private elementRef: ElementRef,
              private renderer: Renderer2,
              private uiStateStore: UIStateStore,
              private cdr: ChangeDetectorRef,
              private ngZone: NgZone) {
    this.el = elementRef.nativeElement
  }

  @Input()
  set show(showMap: boolean) {
    if (showMap) {
      setTimeout(() => this.map.invalidateSize(true), 0)
    }
  }

  @Input()
  set resize(event: any) {
    if(event != null && this.map) {
      setTimeout(() => this.map.invalidateSize(true), 0)
    }
  }

  @Input()
  set reload(provenances: Provenance[]) {
    if(this.isMapInitialised) {
      this.removeMarkers()
      this.loadMarkers()
    }
  }

  ngOnDestroy() {
    if(this.map != null)
      this.map.remove()
  }

  ngAfterViewInit() {
    if (!this.isMapInitialised) {
      this.map = this.ngZone.runOutsideAngular(() => L.map(this.mapElementRef.nativeElement, {
        zoomControl: false,
        center: L.latLng(22.966484, 14.062500),
        zoom: 3,
        minZoom: 3,
        maxZoom: 18,
        layers: [this.mapService.baseMaps.OpenStreetMap]
      }))


      L.control.zoom({position: "topright"}).addTo(this.map)
      L.control.layers(this.mapService.baseMaps).addTo(this.map)
      L.control.scale().addTo(this.map)

      setTimeout(() => this.map.invalidateSize(true), 0)
      this.loadMarkers()
      this.isMapInitialised = true
    }
  }


  loadMarkers() {
    if (this.uiStateStore.hasProvenances) {
      this.uiStateStore
        .getProvenances()
        .forEach(prov => {
          let content = JSON.parse(prov.content)
          if (content.decimalLatitude && content.decimalLongitude)
            this.addMarker(content)
        })
    }
  }

  removeMarkers() {
    this.markers.forEach(m => this.map.removeLayer(m))
    this.markers = []
  }

  addMarker(content: any) {
    if (content.decimalLatitude.double && content.decimalLongitude.double) {
      let latlong = L.latLng(content.decimalLatitude.double, content.decimalLongitude.double)
      let pinAnchor = L.point(13, 41)
      let popupAnchor = L.point(0, -45)
      let marker = L.marker(latlong, {
        icon: L.icon({
          iconUrl: this.markerIconUrl,
          shadowUrl: this.markerShadowUrl,
          iconAnchor: pinAnchor,
          popupAnchor: popupAnchor
        }),
        draggable: false
      }).addTo(this.map)

      marker.bindPopup(this.popupContent(content))
      this.markers.push(marker)
    }
  }

  popupContent(markerObj: any): string {
    let pc: string = ""
    for (let key in markerObj) {
      if (markerObj.hasOwnProperty(key)) {
        pc = pc + "<b>" + JSON.stringify(markerObj[key][Object.keys(markerObj[key])[0]]) + "</b><br/>"
      }
    }
    return pc
  }
}
