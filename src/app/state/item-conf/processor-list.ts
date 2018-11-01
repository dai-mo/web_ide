/*
Copyright (c) 2017-2018 brewlabs SAS
*/
import { UIStateStore } from "./../ui.state.store"
import { ItemConf, Item, ItemStatus } from "@blang/properties"
import {
  ProcessorServiceDefinition,
  ProcessorDetails,
  Processor,
  FlowInstance
} from "../../model/flow.model"
import { ObservableState } from "../state"
import { FlowService } from "../../analyse/service/flow.service"
import { ProcessorService } from "../../service/processor.service"
import { ErrorService } from "../../service/error.service"
import { Observable } from "rxjs/Observable"
import { ProcessorInfo } from "./processor-info"
import { UPDATE_FLOW_INSTANCE } from "../reducers"

export class ProcessorList extends ItemConf {
  constructor(
    defs: ProcessorServiceDefinition[],
    private oss: ObservableState,
    private uiStateStore: UIStateStore,
    private flowService: FlowService,
    private processorService: ProcessorService,
    private errorService: ErrorService
  ) {
    super(false)
    defs.forEach((psd: ProcessorServiceDefinition) =>
      this.items.push(
        new Item(
          psd.processorServiceClassName,
          psd.processorServiceClassName,
          "",
          ItemStatus.OK,
          [],
          [],
          psd
        )
      )
    )
    if (this.items.length === 1) this.select(this.items[0].id)
  }

  select(itemId: string): void {
    const selectedProcessorServiceDefinition = this.items.find(fe => fe.id === itemId)
    if (selectedProcessorServiceDefinition !== undefined) {
      let details: Observable<ProcessorDetails>
      if (selectedProcessorServiceDefinition.state.stateful !== undefined)
        details = this.processorService.details(
          itemId,
          selectedProcessorServiceDefinition.state.stateful
        )
      else details = this.processorService.details(itemId)
      details.subscribe(
        (processorDetails: ProcessorDetails) => {
          this.addFieldGroups(itemId, [
            ProcessorInfo.fromMetaData(processorDetails.metadata),
            ProcessorInfo.fromConfiguration(processorDetails.configuration),
            ProcessorInfo.fromRelationships(processorDetails.relationships)
          ])

          super.select(itemId)
        },
        (error: any) => {
          this.errorService.handleError(error)
        }
      )
    }
  }

  postFinalise(data?: any): void {
    const selectedProcessorServiceDefinition = this.items.find(
      fe => fe.id === this.selectedItemId
    )
    const flowInstanceId = this.oss.activeFlowTab().flowInstance.id
    if (
      flowInstanceId !== undefined &&
      selectedProcessorServiceDefinition !== undefined
    )
      this.processorService
        .create(flowInstanceId, selectedProcessorServiceDefinition.state)
        .subscribe(
          (processor: Processor) => {
            this.uiStateStore.isProcessorConfDialogVisible = false
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
          },
          (error: any) => {
            this.errorService.handleError(error)
          }
        )
  }

  cancel(): void {
    this.uiStateStore.isProcessorConfDialogVisible = false
  }
}
