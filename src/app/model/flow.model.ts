/*
Copyright (c) 2017-2018 brewlabs SAS
*/
import { ValidationErrorResponse } from "../service/error.service"
import { FieldVisibilityLevel } from "@blang/properties"

/**
 * Created by cmathew on 14/07/16.
 */

export enum EntityType {
  UNKNOWN,
  FLOW_INSTANCE,
  PROCESSOR,
  CONNECTION
}

export class Entity {
  id: string
  type: EntityType
}

export class RemoteProcessor {
  static UnknownProcessorType = "unknown"
  static IngestionProcessorType = "ingestion"
  static WorkerProcessorType = "worker"
  static SinkProcessorType = "sink"
  static BatchProcessorType = "batch"
  static ExternalProcessorType = "external"
  static InputPortIngestionType = "input-port-ingestion"
}

export class FlowComponent {
  static ProcessorType = "PROCESSOR"
  static ExternalProcessorType = "EXTERNAL_PROCESSOR"
  static InputPortIngestionType = "INPUT_PORT_INGESTION_TYPE"
  static RemoteInputPortType = "REMOTE_INPUT_PORT"
  static RemoteOutputPortType = "REMOTE_OUTPUT_PORT"
  static InputPortType = "INPUT_PORT"
  static OutputPortType = "OUTPUT_PORT"
  static FunnelType = "FUNNEL"

  static isProcessor(componentType: string): boolean {
    return (
      componentType === FlowComponent.ProcessorType ||
      componentType === FlowComponent.ExternalProcessorType ||
      componentType === FlowComponent.InputPortIngestionType
    )
  }
}

export class FlowTemplate {
  id: string
  name: string
  description: string
  uri: string
  date: string
}

export class SchemaProperties {
  static _FIELDS_TO_MAP = "_FIELDS_TO_MAP"
  static _FIELD_ACTIONS = "_FIELDS_ACTIONS"
}

export enum PropertyLevel {
  ProcessorCoreProperty = 1,
  ProcessorSchemaProperty = 2,
  ExternalProcessorProperty = 3
}

export class ExternalProcessorProperties {
  static ReceiverKey = "_EXTERNAL_RECEIVER"
  static SenderKey = "_EXTERNAL_SENDER"

  static RootInputConnectionIdKey = "_ROOT_INPUT_CONNECTION_ID"
  static RootOutputConnectionIdKey = "_ROOT_OUTPUT_CONNECTION_ID"

  static InputPortNameKey = "_INPUT_PORT_NAME"
  static OutputPortNameKey = "_OUTPUT_PORT_NAME"
}

export class CoreProperties {
  static _PROCESSOR_CLASS = "_PROCESSOR_CLASS"
  static _PROCESSOR_TYPE = "_PROCESSOR_TYPE"
  static _READ_SCHEMA_ID = "_READ_SCHEMA_ID"
  static _READ_SCHEMA = "_READ_SCHEMA"
  static _WRITE_SCHEMA_ID = "_WRITE_SCHEMA_ID"
  static _WRITE_SCHEMA = "_WRITE_SCHEMA"
}

export class PossibleValue {
  value: string
  displayName: string
  description: string
}

export class PropertyDefinition {
  displayName: string
  name: string
  description: string
  defaultValue: string
  possibleValues: PossibleValue[]
  required: boolean
  sensitive: boolean
  dynamic: boolean
  type: string
  level: number
}

export class Connectable {
  id: string
  componentType: string
  flowInstanceId: string
  properties: any
}

export class ConnectionConfig {
  flowInstanceId: string
  source: Connectable
  destination: Connectable
  selectedRelationships: string[]
  availableRelationships: string[]
}

export class Connection {
  id: string
  name: string
  version: string
  config: ConnectionConfig
  relatedConnections: Connection[]
}

export class RemoteRelationship {
  id: string
  description: string
  autoTerminate: boolean
}

export class MetaData {
  description: string
  tags: string[]
  related: string[]
}

export class TriggerType {
  public static readonly DEFAULT = "DEFAULT"
  public static readonly SERIALLY = "SERIALLY"
  public static readonly WHEN_ANY_DESTINATION_AVAILABLE = "WHEN_ANY_DESTINATION_AVAILABLE"
  public static readonly WHEN_EMPTY = "WHEN_EMPTY"
}

export class InputRequirementType {
  public static readonly INPUT_REQUIRED = "INPUT_REQUIRED"
  public static readonly INPUT_ALLOWED = "INPUT_ALLOWED"
  public static readonly INPUT_FORBIDDEN = "INPUT_FORBIDDEN"
}

export class Configuration {
  inputMimeType: string
  outputMimeType: string
  processorClassName: string
  stateful = false
  triggerType: string = TriggerType.DEFAULT
  inputRequirementType: string = InputRequirementType.INPUT_ALLOWED
}

export class ProcessorDetails {
  metadata: MetaData
  configuration: Configuration
  relationships: RemoteRelationship[]
}

export class Processor {
  id: string
  type: string
  version: string
  processorType: string
  status: string
  properties: any
  propertyDefinitions: PropertyDefinition[]
  relationships: RemoteRelationship[]
  validationErrors: ValidationErrorResponse
}

export class ProcessorServiceDefinition {
  processorServiceClassName: string
  processorType: string
  stateful: boolean
}

export class FlowInstance {
  static stateRunning = "RUNNING"
  static stateStopped = "STOPPED"
  static stateNotStarted = "NOT_STARTED"

  id: string
  name: string
  nameId: string
  version: string
  state: string
  processors: Processor[]
  connections: Connection[]

  static hasExternal(flowInstance: FlowInstance): boolean {
    if (
      flowInstance.connections.find(c => {
        return (
          c.config.source.componentType ===
            FlowComponent.ExternalProcessorType ||
          c.config.destination.componentType ===
            FlowComponent.ExternalProcessorType ||
          c.config.source.componentType ===
            FlowComponent.InputPortIngestionType ||
          c.config.destination.componentType ===
            FlowComponent.InputPortIngestionType
        )
      }) !== undefined
    )
      return true

    return false
  }

  validationErrors(): ValidationErrorResponse[] {
    return this.processors.map(p => p.validationErrors)
  }
}

export class FlowNode {
  label: string
  uuid: string
  id: string
  type: string
  ptype: string
  title: string
  image: string
  shape = "image"
  color: {
    background: string
    highlight: { background: string }
  } = {
    background: "white",
    highlight: { background: "white" }
  }
  validationErrors: ValidationErrorResponse

  private baseUrl: string = window.location.protocol +
  "//" +
  window.location.host

  constructor(
    uuid: string,
    type: string,
    ptype: string,
    validationErrors: ValidationErrorResponse,
    label: string = ""
  ) {
    this.uuid = uuid
    this.id = uuid
    this.label = label
    this.type = type
    this.ptype = ptype
    this.title = type.split(".").pop()
    this.image = this.pTypeImage(ptype)
    this.validate(validationErrors)
  }

  validate(validationErrors: ValidationErrorResponse) {
    if (
      validationErrors !== undefined &&
      validationErrors.validationInfo.length > 0
    ) {
      this.color.background = "#8e2f33"
      this.color.highlight.background = "#8e2f33"
      this.validationErrors = validationErrors
    }
  }

  pTypeImage(ptype: string): string {
    switch (ptype) {
      case RemoteProcessor.IngestionProcessorType:
        return this.baseUrl + "/assets/images/ingestion_processor.svg"
      case RemoteProcessor.WorkerProcessorType:
        return this.baseUrl + "/assets/images/worker_processor.svg"
      case RemoteProcessor.SinkProcessorType:
        return this.baseUrl + "/assets/images/sink_processor.svg"
      case RemoteProcessor.InputPortIngestionType:
        return this.baseUrl + "/assets/images/ingestion_processor.svg"
      default:
        return this.baseUrl + "/assets/images/worker_processor.svg"
    }
  }
}

export class FlowEdge {
  id: string
  from: string
  to: string
  arrows: string
  connection: Connection

  constructor(
    from: string,
    to: string,
    connection: Connection,
    arrows: string = "to"
  ) {
    this.id = this.genId(connection)
    this.from = from
    this.to = to
    this.connection = connection
    this.arrows = arrows
  }

  genId(connection: Connection): string {
    if (connection.id === "")
      return (
        connection.config.source.id + "-" + connection.config.destination.id
      )
    else return connection.id
  }
}

export class FlowGraph {
  nodes: FlowNode[]
  edges: FlowEdge[]

  constructor(nodes: FlowNode[] = [], edges: FlowEdge[] = []) {
    this.nodes = nodes
    this.edges = edges
  }
}

export class FlowTab {
  title: string
  id?: string = undefined
  name = ""
  flowInstance?: FlowInstance = undefined
  labelToggle = false
  active = false
  disabled = false
  removable = false

  constructor(
    title: string,
    id: string,
    name: string = "",
    flowInstance: FlowInstance,
    labelToggle: boolean = false,
    active: boolean = false,
    disabled: boolean = false,
    removable: boolean = false
  ) {
    this.title = title
    this.id = id
    this.name = name
    this.flowInstance = flowInstance
    this.labelToggle = labelToggle
    this.active = active
    this.disabled = disabled
    this.removable = removable
  }
}

export class VisTab {
  visType: string
  active: boolean

  constructor(visType: string, active: boolean = false) {
    this.visType = visType
    this.active = active
  }
}

export class Provenance {
  id: string
  content: string
}

export class Action {
  label: string
}

export class DCSError {
  code: string
  message: string
  httpStatusCode: number
  errorMessage: string
}

export class FlowInstantiation {
  id: string
}
