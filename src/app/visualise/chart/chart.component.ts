/**
 * Created by cmathew on 25.11.16.
 */

import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  AfterViewInit,
  AfterViewChecked,
  ViewChild,
  ElementRef
} from "@angular/core"
import { UIStateStore } from "../../state/ui.state.store"
import { Provenance } from "../../model/flow.model"

declare var Plotly: any

@Component({
  selector: "abk-chart",
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.scss"]
})
export class ChartComponent implements AfterViewInit, OnDestroy {
  @ViewChild("chart") chartElementRef: ElementRef

  private data: any
  private xData: Array<any> = []
  private yData: Array<any> = []
  private layout: any
  private options: any

  private isChartInitialised = false

  constructor(private uiStateStore: UIStateStore) {
    this.options = {
      scrollZoom: true
    }
  }

  @Input()
  set reload(provenances: Provenance[]) {
    if (provenances != null && this.isChartInitialised) {
      this.reloadData()
      this.data = [{ x: this.xData, y: this.yData, type: "bar" }]
      Plotly.newPlot(
        this.chartElementRef.nativeElement,
        this.data,
        this.layout,
        this.options
      )
      Plotly.redraw(this.chartElementRef.nativeElement)
    }
  }

  ngOnDestroy() {
    Plotly.purge(this.chartElementRef.nativeElement)
  }

  ngAfterViewInit() {
    this.reloadData()
    this.data = [{ x: this.xData, y: this.yData, type: "bar" }]
    Plotly.newPlot(
      this.chartElementRef.nativeElement,
      this.data,
      this.layout,
      this.options
    )
    this.isChartInitialised = true
  }

  reloadData() {
    if (this.uiStateStore.hasProvenances) {
      const xyData: Map<string, number> = new Map()
      this.xData = []
      this.yData = []

      this.uiStateStore.getProvenances().forEach(prov => {
        const content = JSON.parse(prov.content)
        const x = content.institutionCode.string
        const count = xyData.get(x)
        if (count !== undefined) xyData.set(x, count + 1)
        else xyData.set(x, 1)
      })
      xyData.forEach(this.mapToData.bind(this))
    }
  }

  mapToData(value: any, key: any, map: Map<any, any>) {
    this.xData.push(key)
    this.yData.push(value)
  }
}
