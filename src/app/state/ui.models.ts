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
