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
import { Component } from "@angular/core"
import { UIStateStore } from "../../state/ui.state.store"
import { ObservableState } from "../../state/state"
import {
  FlowComponent,
  Connectable,
  Connection,
  ConnectionConfig,
  CoreProperties,
  EntityType,
  FlowInstance,
  Processor,
  RemoteRelationship,
  RemoteProcessor
} from "../../model/flow.model"
import { FlowUtils } from "../../util/ui.utils"
import { ConnectionService } from "../../analyse/service/connection.service"
import { ErrorService } from "../../service/error.service"
import { SELECT_ENTITY, UPDATE_FLOW_INSTANCE } from "../../state/reducers"
import { FlowService } from "../../analyse/service/flow.service"

/**
 * Created by cmathew on 20.07.17.
 */
@Component({
  selector: "abk-relationships",
  templateUrl: "./relationships.component.html",
  styleUrls: ["./relationships.component.scss"]
})
export class RelationshipsComponent {
  flowInstanceId: string
  sourceProcessor: Processor
  destinationProcessor: Processor
  sourceConnections: Connection[]
  rels: RemoteRelationship[]

  selectedRel: string

  connections: any = {}

  constructor(
    private connectionService: ConnectionService,
    private flowService: FlowService,
    private errorService: ErrorService,
    public uiStateStore: UIStateStore,
    private oss: ObservableState
  ) {
    this.flowInstanceId = this.oss.activeFlowTab().flowInstance.id
    this.sourceProcessor = this.oss.selectedProcessor()
    this.destinationProcessor = this.oss.processorToConnect()
    this.sourceConnections = this.oss.connectionsForSourceProcessor(
      this.oss.selectedProcessor().id
    )
    this.rels = this.sourceProcessor.relationships
    this.rels.forEach(r => (this.connections[r.id] = this.label(r)))
  }

  private getComponentType(processorType: string): string {
    switch (processorType) {
      case RemoteProcessor.ExternalProcessorType:
        return FlowComponent.ExternalProcessorType
      default:
        return FlowComponent.ProcessorType
    }
  }

  save() {
    this.oss.dispatch({
      type: SELECT_ENTITY,
      payload: {
        id: this.oss.activeFlowTab().flowInstance.id,
        type: EntityType.FLOW_INSTANCE
      }
    })

    if (this.selectedRel !== undefined) {
      const source: Connectable = {
        id: this.sourceProcessor.id,
        componentType: this.getComponentType(
          this.sourceProcessor.processorType
        ),
        flowInstanceId: this.flowInstanceId,
        properties: {
          [CoreProperties._PROCESSOR_TYPE]: this.sourceProcessor.processorType
        }
      }

      const destination: Connectable = {
        id: this.destinationProcessor.id,
        componentType: this.getComponentType(
          this.destinationProcessor.processorType
        ),
        flowInstanceId: this.flowInstanceId,
        properties: {
          [CoreProperties._PROCESSOR_TYPE]: this.destinationProcessor
            .processorType
        }
      }

      const connectionConfig: ConnectionConfig = {
        flowInstanceId: this.flowInstanceId,
        source: source,
        destination: destination,
        selectedRelationships: [this.selectedRel],
        availableRelationships: []
      }

      this.connectionService.create(connectionConfig).subscribe(
        (connection: Connection) => {
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
              },
              (error: any) => {
                this.errorService.handleError(error)
              }
            )
          this.uiStateStore.isRelationshipsSettingsDialogVisible = false
        },
        (error: any) => {
          this.errorService.handleError(error)
        }
      )
    }
  }

  cancel() {
    this.uiStateStore.isRelationshipsSettingsDialogVisible = false
    this.oss.dispatch({
      type: SELECT_ENTITY,
      payload: {
        id: this.oss.activeFlowTab().flowInstance.id,
        type: EntityType.FLOW_INSTANCE
      }
    })
  }

  ok() {
    this.uiStateStore.isRelationshipsInfoDialogVisible = false
  }

  select(event: any) {
    this.connections[this.selectedRel] = this.destination(
      this.rels.find(r => r.id === this.selectedRel)
    )
  }

  destination(rel: RemoteRelationship): string {
    if (rel.autoTerminate) return "auto-terminate"
    else
      return this.oss
        .connectionsForSourceProcessor(this.oss.selectedProcessor().id)
        .map(c =>
          FlowUtils.processorServiceClassName(
            this.oss.processor(c.config.destination.id)
          )
        )
        .join()
  }

  label(rel: RemoteRelationship): string {
    return rel.id + " -> " + this.destination(rel)
  }
}
