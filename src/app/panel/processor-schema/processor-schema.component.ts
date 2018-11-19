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
import { Component, Input, OnInit, ViewChild } from "@angular/core"
import { SchemaPanelComponent } from "../schema/schema-panel.component"
import { UIStateStore } from "../../state/ui.state.store"
import { ObservableState } from "../../state/state"
import { FlowService } from "../../analyse/service/flow.service"
import {
  ErrorService,
  ValidationErrorResponse
} from "../../service/error.service"
import { Processor, FlowInstance } from "../../model/flow.model"
import { UPDATE_FLOW_INSTANCE } from "../../state/reducers"

/**
 * Created by cmathew on 19.05.17.
 */
@Component({
  selector: "abk-processor-schema",
  templateUrl: "./processor-schema.component.html",
  styleUrls: ["./processor-schema.component.scss"]
})
export class ProcessorSchemaComponent {
  @ViewChild(SchemaPanelComponent) schemaPanelComponent: SchemaPanelComponent

  constructor(
    public uiStateStore: UIStateStore,
    public oss: ObservableState,
    private flowService: FlowService,
    private errorService: ErrorService
  ) {}

  selectedProcessor$ = this.oss.selectedProcessor$()

  save() {
    this.schemaPanelComponent.updateSchema().subscribe(
      (processors: Processor[]) => {
        const vers: ValidationErrorResponse[] = processors
          .map(p => p.validationErrors)
          .filter(
            ver =>
              ver !== undefined &&
              ver.validationInfo.find(vi => vi.code === "DCS310") !== undefined
          )
        if (vers.length > 0) {
          this.errorService.handleValidationErrors(vers)
        } else {
          this.flowService
            .instance(this.oss.activeFlowTab().flowInstance.id)
            .subscribe(
              (flowInstance: FlowInstance) => {
                this.oss.dispatch({
                  type: UPDATE_FLOW_INSTANCE,
                  payload: {
                    flowInstance: flowInstance
                  }
                })
                this.uiStateStore.isProcessorSchemaDialogVisible = false
              },
              (error: any) => {
                this.errorService.handleError(error)
              }
            )
        }
      },
      (error: any) => {
        this.errorService.handleError(error)
      }
    )
  }

  cancel() {
    this.uiStateStore.isProcessorSchemaDialogVisible = false
  }
}
