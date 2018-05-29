import { Field, FieldGroup, FlowEntity, FlowEntityConf } from "../state/fields"
import {
  EntityType,
  FlowInstance,
  Processor,
  PropertyDefinition
} from "../model/flow.model"
import { FlowService } from "../analyse/service/flow.service"
import { ErrorService } from "../service/error.service"
import { ProcessorService } from "../service/processor.service"
import { ObservableState } from "../state/state"
import { FlowUtils, JSUtils } from "../util/ui.utils"
import {
  SELECT_ENTITY,
  UPDATE_FLOW_INSTANCE,
  UPDATE_PROCESSOR_PROPERTIES_DIALOG_VISIBILITY,
  UPDATE_SELECTED_FLOW_ENTITY_CONF,
  UPDATE_SELECTED_PROCESSOR
} from "../state/reducers"
import { UIStateStore } from "../state/ui.state.store"
import { NotificationService } from "../service/notification.service"

export class ProcessorPropertiesConf extends FlowEntityConf {
  private processor: Processor
  private properties: any
  private propertiesFieldGroup: FieldGroup
  private propertySpecificFields: Field[]

  constructor(
    processor: Processor,
    private oss: ObservableState,
    private processorService: ProcessorService,
    private flowService: FlowService,
    private errorService: ErrorService,
    private notificationService: NotificationService
  ) {
    super(oss)
    this.processor = processor
    this.selectedFlowEntityId = processor.id
    this.properties = processor.properties
    this.propertiesFieldGroup = new FieldGroup("properties")
    this.propertySpecificFields = []

    this.processorService
      .properties(FlowUtils.processorServiceClassName(this.processor))
      .subscribe((propertyDefinitions: PropertyDefinition[]) => {
        propertyDefinitions.forEach(pd => {
          // let pvs: string[] = []
          // if (pd.possibleValues !== undefined)
          //   pvs = pd.possibleValues.map(pv => pv.value)

          const field: Field = Field.fromPDef(
            pd,
            this.properties[pd.name],
            true
          )

          if (!field.isHiddenPropertyField()) {
            if (field.isSchemaField()) this.propertySpecificFields.push(field)
            else this.propertiesFieldGroup.add(field)
          }
        })

        if (
          this.propertiesFieldGroup.fields.length > 0 ||
          this.propertySpecificFields.length > 0
        ) {
          this.flowEntities.push(
            new FlowEntity(processor.id, processor.processorType, "")
          )
          if (this.propertiesFieldGroup.fields.length > 0)
            this.flowEntityFieldGroupsMap.set(processor.id, [
              this.propertiesFieldGroup
            ])
          if (this.propertySpecificFields.length > 0)
            this.flowEntitySpecificFieldsMap.set(
              processor.id,
              this.propertySpecificFields
            )
        }

        if (!this.hasEntities()) {
          this.oss.dispatch({
            type: UPDATE_PROCESSOR_PROPERTIES_DIALOG_VISIBILITY,
            payload: false
          })
          this.notificationService.warn({
            title: "Processor Properties",
            description: "No configurable properties for chosen processor"
          })
        } else {
          this.oss.dispatch({
            type: UPDATE_SELECTED_FLOW_ENTITY_CONF,
            payload: { flowEntityConf: this }
          })
          this.oss.dispatch({
            type: UPDATE_PROCESSOR_PROPERTIES_DIALOG_VISIBILITY,
            payload: true
          })
        }
      })
  }

  finalise(uiStateStore: UIStateStore, data?: any): void {
    if (!JSUtils.isUndefinedOrEmpty(data)) {
      const properties = FlowUtils.addExternalCoreProperties(
        this.processor,
        data
      )
      this.processorService
        .updateProperties(
          FlowUtils.processorServiceClassName(this.processor),
          this.processor.id,
          properties,
          this.oss.activeFlowTab().flowInstance.id
        )
        .map((processor: Processor) => {
          if (processor.validationErrors !== undefined)
            this.errorService.handleValidationErrors([
              processor.validationErrors
            ])
          else {
            this.oss.dispatch({
              type: UPDATE_SELECTED_PROCESSOR,
              payload: { processor: processor }
            })

            this.oss.dispatch({
              type: UPDATE_PROCESSOR_PROPERTIES_DIALOG_VISIBILITY,
              payload: false
            })
            uiStateStore.setProcessorPropertiesToUpdate(undefined)
          }
          return processor
        })
        .flatMap((processor: Processor) =>
          this.flowService.instance(this.oss.activeFlowTab().flowInstance.id)
        )
        .subscribe(
          (flowInstance: FlowInstance) => {
            this.oss.dispatch({
              type: UPDATE_FLOW_INSTANCE,
              payload: {
                flowInstance: flowInstance
              }
            })
            this.oss.dispatch({
              type: SELECT_ENTITY,
              payload: {
                id: this.oss.activeFlowTab().flowInstance.id,
                type: EntityType.FLOW_INSTANCE
              }
            })
          },
          (error: any) => {
            this.errorService.handleError(error)
          }
        )
    }
  }

  cancel(uiStateStore: UIStateStore): void {
    this.oss.dispatch({
      type: UPDATE_PROCESSOR_PROPERTIES_DIALOG_VISIBILITY,
      payload: false
    })
  }
}
