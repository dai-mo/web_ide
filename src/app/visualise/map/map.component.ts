/*
Copyright (c) 2017-2018 brewlabs SAS

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/**
 * Created by cmathew on 22.11.16.
 */
import { MapService } from "./map.service"
import {
  Component,
  AfterViewInit,
  ElementRef,
  Input,
  ViewChild,
  OnDestroy,
  Renderer2,
  NgZone,
  OnChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core"
import { Map } from "leaflet"

import LatLng = L.LatLng
import Marker = L.Marker

import * as L from "leaflet"
import { UIStateStore } from "../../state/ui.state.store"
import { Provenance } from "../../model/flow.model"

@Component({
  selector: "abk-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @ViewChild("map") mapElementRef: ElementRef

  private el: HTMLElement
  private mapEl: HTMLElement

  public map: Map
  private markers: Array<Marker> = []
  private isMapInitialised = false

  private baseUrl: string = window.location.protocol +
  "//" +
  window.location.host +
  "/"

  private markerIconUrl: string = this.baseUrl +
  "assets/lib/leaflet/dist/images/marker-icon.png"
  private markerShadowUrl: string = this.baseUrl +
  "assets/lib/leaflet/dist/images/marker-shadow.png"

  constructor(
    private mapService: MapService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private uiStateStore: UIStateStore,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
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
    if (event != null && this.map) {
      setTimeout(() => this.map.invalidateSize(true), 0)
    }
  }

  @Input()
  set reload(provenances: Provenance[]) {
    if (this.isMapInitialised) {
      this.removeMarkers()
      this.loadMarkers()
    }
  }

  ngOnDestroy() {
    if (this.map != null) this.map.remove()
  }

  ngAfterViewInit() {
    if (!this.isMapInitialised) {
      this.map = this.ngZone.runOutsideAngular(() =>
        L.map(this.mapElementRef.nativeElement, {
          zoomControl: false,
          center: L.latLng(22.966484, 14.0625),
          zoom: 3,
          minZoom: 3,
          maxZoom: 18,
          layers: [this.mapService.baseMaps.OpenStreetMap]
        })
      )

      L.control.zoom({ position: "topright" }).addTo(this.map)
      L.control.layers(this.mapService.baseMaps).addTo(this.map)
      L.control.scale().addTo(this.map)

      setTimeout(() => this.map.invalidateSize(true), 0)
      this.loadMarkers()
      this.isMapInitialised = true
    }
  }

  loadMarkers() {
    if (this.uiStateStore.hasProvenances) {
      this.uiStateStore.getProvenances().forEach(prov => {
        const content = JSON.parse(prov.content)
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
      const latlong = L.latLng(
        content.decimalLatitude.double,
        content.decimalLongitude.double
      )
      const pinAnchor = L.point(13, 41)
      const popupAnchor = L.point(0, -45)
      const marker = L.marker(latlong, {
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
    let pc = ""
    for (const key in markerObj) {
      if (markerObj.hasOwnProperty(key)) {
        pc =
          pc +
          "<b>" +
          JSON.stringify(markerObj[key][Object.keys(markerObj[key])[0]]) +
          "</b><br/>"
      }
    }
    return pc
  }
}
