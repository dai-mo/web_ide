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
import { MessageService } from "primeng/components/common/messageservice"
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
  private propertySpecificFields: ProcessorPropertyField[]

  static fromPDef(
    pd: PropertyDefinition,
    value: string,
    isEditable: boolean
  ): ProcessorPropertyField {
    return new ProcessorPropertyField(
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
    private notificationService: NotificationService,
    private messageService: MessageService
  ) {
    super(true)
    this.processor = processor
    this.propertySpecificFields = []

    this.propertiesFieldGroup = this.genFieldGroups(propertyDefinitions)

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

  invalid = (name: string, data: any) =>
    this.messageService.add({
      severity: "warn",
      summary: "Input Validation",
      detail: name + " is invalid"
    })

  genFieldGroups(propertyDefinitions: PropertyDefinition[]): FieldGroup {
    const propertyFields: ProcessorPropertyField[] = []
    propertyDefinitions.forEach((pd: PropertyDefinition) => {
      const field: ProcessorPropertyField = ProcessorProperties.fromPDef(
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

    return new FieldGroup("properties", propertyFields, this.invalid)
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
