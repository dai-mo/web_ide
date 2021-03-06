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
import { ObservableState } from "./../state"
import { UIStateStore } from "./../ui.state.store"
import {
  ItemConf,
  Item,
  Field,
  FieldGroup,
  ItemStatus
} from "@blang/properties"
import { KeycloakService } from "../../service/keycloak.service"
import { FlowInstance } from "../../model/flow.model"
import { ADD_FLOW_TABS } from "../reducers"
import { ErrorService } from "../../service/error.service"
import { UIUtils } from "../../util/ui.utils"
import { FlowService } from "../../analyse/service/flow.service"
import { MessageService } from "primeng/components/common/messageservice"

export class FlowCreation extends ItemConf {
  private readonly FLOW_NAME = "name"

  constructor(
    private oss: ObservableState,
    private flowService: FlowService,
    private uiStateStore: UIStateStore,
    private messageService: MessageService,
    private errorService: ErrorService
  ) {
    super(true)
    this.selectedItemId = this.FLOW_NAME
    this.items.push(
      new Item(
        this.FLOW_NAME,
        this.FLOW_NAME,
        "Creates a new data flow",
        ItemStatus.OK,
        this.genFieldGroups()
      )
    )
  }

  invalid = (name: string, data: any) =>
    this.messageService.add({
      severity: "warn",
      summary: "Input Validation",
      detail: name + " is invalid"
    })

  genFieldGroups(): FieldGroup[] {
    const name: Field = new Field(
      this.FLOW_NAME,
      this.FLOW_NAME,
      "Flow Name",
      "",
      [],
      "",
      true,
      true
    )
    const flowDetails = new FieldGroup("Flow Details", [name], this.invalid)
    return [flowDetails]
  }

  postFinalise(data?: any): void {
    KeycloakService.withTokenUpdate(
      function(rpt: string) {
        this.flowService.create(data.name, rpt).subscribe(
          (flowInstance: FlowInstance) => {
            const tab = UIUtils.toFlowTab(flowInstance)
            this.oss.dispatch({
              type: ADD_FLOW_TABS,
              payload: { flowTabs: [tab] }
            })
            this.uiStateStore.setFlowCreationDialogVisible(false)
          },
          (error: any) => {
            this.errorService.handleError(error)
          }
        )
      }.bind(this)
    )
  }

  cancel(): void {
    this.uiStateStore.isFlowCreationDialogVisible = false
  }
}
