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
