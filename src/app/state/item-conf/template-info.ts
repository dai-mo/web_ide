/*
Copyright (c) 2017-2018 brewlabs SAS
*/
import {
  ItemConf,
  Item,
  ItemStatus,
  FieldGroup,
  Field
} from "@blang/properties"

import { ObservableState } from "../../state/state"
import { FlowEntity } from "../../state/fields"
import { UIStateStore } from "../../state/ui.state.store"
import { FlowTemplate } from "../../model/flow.model"

export class TemplateInfo extends ItemConf {
  constructor(
    flowTemplates: FlowTemplate[],
    private uiStateStore: UIStateStore
  ) {
    super(false)
    flowTemplates.forEach(ft => {
      this.items.push(
        new Item(
          ft.id,
          ft.name,
          ft.description,
          ItemStatus.OK,
          this.genFieldGroups(ft)
        )
      )
    })
  }

  genFieldGroups(flowTemplate: FlowTemplate): FieldGroup[] {
    const description = new Field(
      "description",
      "description",
      flowTemplate.description
    )
    const metadata = new FieldGroup("metadata", [description])
    return [metadata]
  }

  postFinalise(data?: any): void {
    this.uiStateStore.updateFlowInstantiationId(this.selectedItemId)
    this.uiStateStore.isTemplateInfoDialogVisible = false
  }

  cancel(): void {
    this.uiStateStore.isTemplateInfoDialogVisible = false
  }
}
