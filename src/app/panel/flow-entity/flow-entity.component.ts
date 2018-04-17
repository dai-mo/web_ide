/**
 * Created by cmathew on 05.05.17.
 */

import { Component, Input, OnInit } from "@angular/core"
import { SelectItem } from "primeng/primeng"
import {
  Field,
  FieldGroup,
  FlowEntityConf,
  FlowEntityStatus
} from "../../state/ui.models"
import { UIStateStore } from "../../state/ui.state.store"
import * as SI from "seamless-immutable"
import { AppState, ObservableState } from "../../state//state"
import { Observable } from "rxjs/Observable"

@Component({
  selector: "abk-flow-entity",
  templateUrl: "./flow-entity.component.html",
  styleUrls: ["./flow-entity.component.scss"]
})
/**
 * NOTE : If this component is used in a p-dialog then *ngIf needs to be added to the p-dialog
 * because the p-listbox in the this component works correctly (individual items can be selected)
 * only when the underlying SelectItem[] (of flow entities) is initialised but never updated.
 * Since the list of items can change and be updated more than once in any user session, updating the entity list
 * is a requirement. The *ngIf ensures that a new instance of this component is created everytime the p-dialog
 * is called implying a new SelectItem[] (of flow entities) of up-to-date entites.
 */
export class FlowEntityComponent {
  entityInfo: FlowEntityConf
  @Input() finaliseLabel: string

  private flowEntityStatus = FlowEntityStatus
  entities: SelectItem[]
  selectedEntityValue: { id: string; status: string }
  selectedEntityFieldGroups: FieldGroup[]
  selectedEntitySpecificFields: Field[]

  selectedFlowEntityConf: Observable<
    FlowEntityConf
  > = this.oss
    .appStore()
    .select((state: AppState) => state.selectedFlowEntityConf)

  constructor(
    private oss: ObservableState,
    private uiStateStore: UIStateStore
  ) {
    this.entityInfo = this.oss.appState().selectedFlowEntityConf
    this.entities = []
    if (this.entityInfo !== undefined) {
      this.entityInfo.list().forEach(fe =>
        this.entities.push({
          label: fe.name,
          value: {
            id: fe.id,
            status: fe.status
          }
        })
      )
    }
    if (this.hasSingleEntity()) this.select(this.entityInfo.list()[0].id)
  }

  hasSingleEntity(): boolean {
    return this.entities.length === 1
  }

  select(flowEntityId: string) {
    this.entityInfo.select(flowEntityId)
    this.selectedEntityFieldGroups = this.entityInfo.fieldGroups(flowEntityId)
    this.selectedEntitySpecificFields = this.entityInfo.specificFields(
      flowEntityId
    )
    this.entityInfo.selectedFlowEntityId = flowEntityId
  }

  finalise() {
    const initial: any = {}
    let updatedProperties = SI.from(initial)

    if (
      this.selectedEntitySpecificFields !== undefined &&
      this.selectedEntitySpecificFields.length > 0
    )
      this.selectedEntitySpecificFields.forEach(sesf => {
        updatedProperties = updatedProperties.merge(sesf.collector())
      })

    if (
      this.selectedEntityFieldGroups !== undefined &&
      this.selectedEntityFieldGroups.length > 0
    )
      this.selectedEntityFieldGroups.forEach(sefg => {
        updatedProperties = updatedProperties.merge(sefg.collector())
      })

    this.entityInfo.finalise(this.uiStateStore, updatedProperties)
  }

  cancel() {
    this.entityInfo.cancel(this.uiStateStore)
  }
}
