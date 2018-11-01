/*
Copyright (c) 2017-2018 brewlabs SAS
*/
import { UIStateStore } from "./ui.state.store"
import {
  Processor,
  FlowInstance,
  ProcessorDetails,
  ProcessorServiceDefinition,
  FlowTemplate,
  RemoteRelationship,
  Configuration,
  MetaData,
  PossibleValue,
  PropertyLevel,
  PropertyDefinition
} from "../model/flow.model"
import {
  UPDATE_FLOW_INSTANCE,
  ADD_FLOW_TABS,
  UPDATE_SELECTED_FLOW_ENTITY_CONF
} from "./reducers"
import { ObservableState } from "./state"
import { ProcessorService } from "../service/processor.service"
import { ErrorService } from "../service/error.service"
import { Observable } from "rxjs/Observable"
import { FlowService } from "../analyse/service/flow.service"
import { KeycloakService } from "../service/keycloak.service"
import { UIUtils } from "../util/ui.utils"
import { SelectItem } from "primeng/primeng"
import { FieldVisibilityLevel } from "@blang/properties"

export enum FieldType {
  STRING,
  NUMBER,
  BOOLEAN,
  UNKNOWN
}

export enum ProcessorFieldUIType {
  SCHEMA_FIELD = 5
}

export class Field {
  name: string
  label: string
  description: string
  defaultValue: string
  possibleValues: PossibleValue[]
  type: FieldType
  value: string
  isEditable: boolean
  selectItems: SelectItem[]
  isRequired: boolean
  collector: () => any
  active = false
  level = FieldVisibilityLevel.ClosedField

  static fieldType(type: string): FieldType {
    switch (type) {
      case "STRING":
        return FieldType.STRING
      case "NUMBER":
        return FieldType.NUMBER
      case "BOOLEAN":
        return FieldType.BOOLEAN
      default:
        return FieldType.UNKNOWN
    }
  }

  static fromPDef(
    pd: PropertyDefinition,
    value: string,
    isEditable: boolean
  ): Field {
    // let pvs: string[] = []
    // if(pd.possibleValues !== undefined)
    //   pvs = pd.possibleValues.map(pv => pv.displayName)
    return new Field(
      pd.name,
      pd.displayName,
      pd.description,
      pd.defaultValue,
      pd.possibleValues,
      Field.fieldType(pd.type),
      value,
      isEditable,
      pd.required,
      pd.level
    )
  }

  constructor(
    name: string,
    label: string,
    description: string = "",
    defaultValue: string = "",
    possibleValues: PossibleValue[] = [],
    type: FieldType = FieldType.STRING,
    value: string = "",
    isEditable: boolean = false,
    isRequired: boolean = false,
    level = FieldVisibilityLevel.ClosedField
  ) {
    this.name = name
    this.label = label
    this.description = description
    this.defaultValue = defaultValue
    this.possibleValues = possibleValues
    this.type = type
    this.value = value
    this.isEditable = isEditable
    this.isRequired = isRequired
    this.level = level
    this.resolveValue()
  }

  resolveValue() {
    if (this.possibleValues.length > 0) {
      // FIXME: Setting the fields value to empty in case of a list of possible
      //        values essentially encodes the fact that users will always have to
      //        choose from the list. This runs counter to the Nifi model where
      //        a processor property definition with a list of possbile values
      //        should have a default value and that too a default value that
      //        belongs to the list of possible values. We should ideally be able to
      //        accomodate both situations.
      this.value = ""
      this.possibleValues = this.possibleValues.filter(pv => pv.value !== "")
      this.selectItems = this.possibleValues.map((pv: PossibleValue) => {
        return { label: pv.displayName, value: pv.value }
      })
    }
  }

  valueToString(value: string | number | boolean): string {
    if (typeof value === "string") {
      return value
    }

    if (typeof value === "number") {
      return value.toString()
    }

    if (typeof value === "boolean") {
      return value.toString()
    }

    return undefined
  }

  updateValue(value: string) {
    this.value = value
  }

  setCollector(collector: () => any) {
    this.collector = collector
  }
}

export class FieldGroup {
  label: string
  fields: Field[] = []
  active = false
  collector: () => any

  constructor(label: string, fields: Field[] = []) {
    this.label = label
    if (fields === undefined) this.fields = []
    else this.fields = fields
  }

  add(field: Field) {
    this.fields.push(field)
  }

  setCollector(collector: () => any) {
    this.collector = collector
  }
}

export enum FlowEntityStatus {
  OK,
  WARNING
}

export class FlowEntity {
  id: string
  name: string
  description: string
  status: FlowEntityStatus
  state?: any

  constructor(
    id: string,
    name: string,
    description: string,
    status: FlowEntityStatus = FlowEntityStatus.OK,
    state?: any
  ) {
    this.id = id
    this.name = name
    this.description = description
    this.status = status
    this.state = state
  }
}

export abstract class FlowEntityConf {
  selectedFlowEntityId: string
  flowEntityFieldGroupsMap: Map<string, FieldGroup[]> = new Map<
    string,
    FieldGroup[]
  >()
  flowEntitySpecificFieldsMap: Map<string, Field[]> = new Map<string, Field[]>()
  flowEntities: FlowEntity[] = []

  hideCancel = false

  constructor(private osstate: ObservableState) {}

  list(): FlowEntity[] {
    return this.flowEntities
  }

  fieldGroups(flowEntityId: string): FieldGroup[] {
    return this.flowEntityFieldGroupsMap.get(flowEntityId)
  }

  selectedEntityFieldGroups(): FieldGroup[] {
    return this.fieldGroups(this.selectedFlowEntityId)
  }

  specificFields(flowEntityId: string): Field[] {
    return this.flowEntitySpecificFieldsMap.get(flowEntityId)
  }

  selectedEntitySpecificFields(): Field[] {
    return this.specificFields(this.selectedFlowEntityId)
  }

  hasEntities(): boolean {
    return this.flowEntities.length > 0
  }

  isSelected(): boolean {
    return this.selectedFlowEntityId !== undefined
  }

  select(flowEntityId: string): void {
    this.selectedFlowEntityId = flowEntityId
    const sefgs = this.selectedEntityFieldGroups()

    if (sefgs !== undefined && sefgs.length > 0) sefgs[0].active = true
    else {
      const sesfs = this.selectedEntitySpecificFields()
      if (sesfs !== undefined && sesfs.length > 0) sesfs[0].active = true
    }

    this.osstate.dispatch({
      type: UPDATE_SELECTED_FLOW_ENTITY_CONF,
      payload: { flowEntityConf: this }
    })
  }

  abstract finalise(uiStateStore: UIStateStore, data?: any): void

  abstract cancel(uiStateStore: UIStateStore): void
}
