import {
  EntityType,
  FlowInstance,
  Processor,
  PropertyDefinition,
  PropertyLevel
} from "../../model/flow.model"
import { FlowService } from "../../analyse/service/flow.service"
import { ErrorService } from "../../service/error.service"
import { ProcessorService } from "../../service/processor.service"
import { ObservableState } from "../../state/state"
import { FlowUtils, JSUtils } from "../../util/ui.utils"
import {
  SELECT_ENTITY,
  UPDATE_FLOW_INSTANCE,
  UPDATE_PROCESSOR_PROPERTIES_DIALOG_VISIBILITY,
  UPDATE_SELECTED_FLOW_ENTITY_CONF,
  UPDATE_SELECTED_PROCESSOR
} from "../../state/reducers"
import { UIStateStore } from "../../state/ui.state.store"
import { NotificationService } from "../../service/notification.service"
import {
  ItemConf,
  FieldGroup,
  Field,
  FieldVisibilityLevel,
  Item,
  FieldUIType,
  ItemStatus
} from "@blang/properties"
import { ProcessorFieldUIType } from "../fields"

export class ProcessorPropertyField extends Field {
  fieldUIType(): number {
    if (ProcessorProperties.isSchemaProperty(this.level))
      return ProcessorFieldUIType.SCHEMA_FIELD
    else return super.fieldUIType()
  }
}

export class ProcessorProperties extends ItemConf {
  private processor: Processor
  private properties: any
  private propertiesFieldGroup: FieldGroup
  private propertySpecificFields: Field[]

  static fromPDef(
    pd: PropertyDefinition,
    value: string,
    isEditable: boolean
  ): Field {
    return new Field(
      pd.name,
      pd.displayName,
      pd.description,
      pd.defaultValue,
      pd.possibleValues,
      value,
      isEditable,
      pd.required,
      pd.level
    )
  }

  static isExternalProcessorProperty(level: number): boolean {
    return level === PropertyLevel.ExternalProcessorProperty
  }

  static isCoreProperty(level: number): boolean {
    return level === PropertyLevel.ProcessorCoreProperty
  }

  static isHiddenProperty(level: number): boolean {
    return (
      level === FieldVisibilityLevel.ClosedField ||
      level === PropertyLevel.ProcessorCoreProperty ||
      level === PropertyLevel.ExternalProcessorProperty
    )
  }

  static isSchemaProperty(level: PropertyLevel): boolean {
    return level === PropertyLevel.ProcessorSchemaProperty
  }

  constructor(
    processor: Processor,
    propertyDefinitions: PropertyDefinition[],
    private oss: ObservableState,
    private processorService: ProcessorService,
    private flowService: FlowService,
    private uiStateStore: UIStateStore,
    private errorService: ErrorService,
    private notificationService: NotificationService
  ) {
    super(true)
    this.processor = processor
    this.propertySpecificFields = []
    const propertyFields: Field[] = []

    propertyDefinitions.forEach((pd: PropertyDefinition) => {
      const field: Field = ProcessorProperties.fromPDef(
        pd,
        this.processor.properties[pd.name],
        true
      )

      if (!ProcessorProperties.isHiddenProperty(pd.level)) {
        if (ProcessorProperties.isSchemaProperty(pd.level))
          this.propertySpecificFields.push(field)
        else propertyFields.push(field)
      }
    })

    this.propertiesFieldGroup = new FieldGroup("properties", propertyFields)

    if (
      this.propertiesFieldGroup.fields.length > 0 ||
      this.propertySpecificFields.length > 0
    ) {
      let fieldGroups: FieldGroup[] = []
      if (this.propertiesFieldGroup.fields.length > 0)
        fieldGroups = [this.propertiesFieldGroup]

      let specificFields: Field[] = []
      if (this.propertySpecificFields.length > 0)
        specificFields = this.propertySpecificFields

      this.items.push(
        new Item(
          this.processor.id,
          this.processor.processorType,
          "",
          ItemStatus.OK,
          fieldGroups,
          specificFields
        )
      )
    }
  }

  postFinalise(data?: any): void {
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
        .map((updatedProcessor: Processor) => {
          if (updatedProcessor.validationErrors !== undefined)
            this.errorService.handleValidationErrors([
              updatedProcessor.validationErrors
            ])
          else {
            this.oss.dispatch({
              type: UPDATE_SELECTED_PROCESSOR,
              payload: { processor: updatedProcessor }
            })

            this.oss.dispatch({
              type: UPDATE_PROCESSOR_PROPERTIES_DIALOG_VISIBILITY,
              payload: false
            })
            this.uiStateStore.setProcessorPropertiesToUpdate(undefined)
          }
          return updatedProcessor
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

  cancel(): void {
    this.oss.dispatch({
      type: UPDATE_PROCESSOR_PROPERTIES_DIALOG_VISIBILITY,
      payload: false
    })
  }
}
