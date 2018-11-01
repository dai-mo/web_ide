/*
Copyright (c) 2017-2018 brewlabs SAS
*/
import { MenuItem, Message, SelectItem } from "primeng/primeng"
import {
  Configuration,
  CoreProperties,
  EntityType,
  FlowInstance,
  FlowTemplate,
  MetaData,
  PossibleValue,
  Processor,
  ProcessorDetails,
  ProcessorServiceDefinition,
  PropertyDefinition,
  PropertyLevel,
  RemoteRelationship,
  SchemaProperties
} from "../model/flow.model"
import { UIStateStore } from "./ui.state.store"
import { ProcessorService } from "../service/processor.service"
import { ErrorService } from "../service/error.service"
import { ObservableState } from "../state/state"
import {
  ADD_FLOW_TABS,
  SELECT_ENTITY,
  UPDATE_FLOW_INSTANCE,
  UPDATE_PROCESSOR_PROPERTIES_DIALOG_VISIBILITY,
  UPDATE_SELECTED_FLOW_ENTITY_CONF,
  UPDATE_SELECTED_PROCESSOR
} from "../state/reducers"
import { FlowService } from "../analyse/service/flow.service"
import { KeycloakService } from "../service/keycloak.service"
import { FlowUtils, JSUtils, UIUtils } from "../util/ui.utils"
import { Observable } from "rxjs/Observable"
import { NotificationService } from "../service//notification.service"

/**
 * Created by cmathew on 04.05.17.
 */

export interface Msg extends Message {}

export class MsgGroup {
  messages: Msg[]
  sticky = false
  delay = 3000

  constructor(messages: Msg[], sticky: boolean, delay: number) {
    this.messages = messages
    this.sticky = sticky
    this.delay = delay
  }
}

export class ModalMessage {
  visible: boolean
  title: string
  content: string
  closable: boolean

  constructor(
    visible: boolean,
    title: string,
    message: string,
    closable: boolean
  ) {
    this.visible = visible
    this.content = message
    this.closable = closable
  }
}

export class UiId {
  static ANALYSE = "analyse"
  static MOBILISE = "mobilise"
  static VISUALISE = "visualise"
  static VIS_MAP = "map"
  static VIS_CHART = "chart"
}

export interface ContextMenuItem extends MenuItem {}

export class ContextBarItem {
  view: string
  entityType: EntityType
  iconClass = ""
  enabled = false
  hidden = false
  command: (event: any) => void
}

export class ViewsVisible {
  analyse: boolean
  mobilise: boolean
  visualise: boolean

  constructor(
    analyse: boolean = true,
    mobilise: boolean = false,
    visualise: boolean = false
  ) {
    this.analyse = analyse
    this.mobilise = mobilise
    this.visualise = visualise
  }

  noViewsVisible(): number {
    if (
      (this.analyse && !this.mobilise && !this.visualise) ||
      (!this.analyse && this.mobilise && !this.visualise) ||
      (!this.analyse && !this.mobilise && this.visualise)
    )
      return 1
    if (
      (!this.analyse && this.mobilise && this.visualise) ||
      (this.analyse && !this.mobilise && this.visualise) ||
      (this.analyse && this.mobilise && !this.visualise)
    )
      return 2
    return 3
  }
}
