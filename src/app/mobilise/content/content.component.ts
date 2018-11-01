/*
Copyright (c) 2017-2018 brewlabs SAS
*/
/**
 * Created by cmathew on 15/08/16.
 */

import { Component, Input, OnInit } from "@angular/core"
import { SelectItem } from "primeng/components/common/api"
import { Provenance, Action, EntityType } from "../../model/flow.model"
import { FlowService } from "../../analyse/service/flow.service"
import { ObservableState } from "../../state/state"
import { ErrorService } from "../../service/error.service"
import { UIStateStore } from "../../state/ui.state.store"
import { ContextBarItem, UiId } from "../../state/ui.models"
import { ADD_CONTEXT_BAR_ITEMS } from "../../state/reducers"

@Component({
  selector: "abk-content",
  templateUrl: "./content.component.html",
  styleUrls: ["./content.component.scss"]
})
export class ContentComponent implements OnInit {
  private provenances: Array<Provenance> = null

  private actions: Action[] = []

  rowOptions: SelectItem[] = []
  selectedRowOption: string

  formatOptions: SelectItem[] = []
  selectedFormatOption: string

  private results: Array<any> = []
  private columns: Set<string> = new Set<string>()

  private formats: Array<string> = ["raw", "csv"]

  constructor(
    private flowService: FlowService,
    private oss: ObservableState,
    private errorService: ErrorService,
    private uiStateStore: UIStateStore
  ) {}

  @Input()
  set showProvenance(processorId: string) {
    this.showResults(processorId)
  }

  showResults(processorId: string) {
    this.actions = []
    if (processorId !== undefined)
      this.flowService.provenance(processorId).subscribe(
        provenances => {
          this.provenances = provenances
          this.uiStateStore.setProvenances(provenances)
          this.toData(this.provenances)
        },
        (error: any) => {
          this.errorService.handleError(error)
          // this.dialog.show("Processor Output", "Output for this processor has expired or been deleted")
        }
      )
    else this.provenances = null
  }

  ngOnInit() {
    const cbItems: ContextBarItem[] = [
      {
        view: UiId.MOBILISE,
        entityType: EntityType.PROCESSOR,
        iconClass: "fa-refresh",
        enabled: true,
        command: event => {
          if (this.oss.selectedProcessor() !== undefined)
            this.showResults(this.oss.selectedProcessor().id)
        },
        hidden: false
      }
    ]

    this.oss.dispatch({
      type: ADD_CONTEXT_BAR_ITEMS,
      payload: {
        key: UiId.MOBILISE,
        items: cbItems
      }
    })
  }

  provenanceInfo(provenance: Provenance) {
    return "<b>id:</b> " + provenance.id
  }

  hasResults(): boolean {
    return this.provenances != null && this.provenances.length > 0
  }

  hasActions(): boolean {
    return this.actions.length > 0
  }

  toData(provs: Array<Provenance>) {
    this.results = []
    this.columns = new Set<string>()
    if (provs != null && provs.length > 0) {
      this.results = provs.map(p => {
        const content = JSON.parse(p.content)
        const record: any = { id: "" }
        for (const key in content) {
          if (content[key]) {
            this.columns.add(key)
            record[key] = JSON.stringify(content[key])
          }
        }
        record.id = p.id
        return record
      })
    }
  }
}
