/*
Copyright (c) 2017-2018 brewlabs SAS
*/
import { ModalMessage, ContextMenuItem, ContextBarItem } from "./ui.models"
/**
 * Created by cmathew on 03.07.17.
 */

import { FlowEntityConf } from "./fields"
import { Action, ActionReducer } from "@ngrx/store"
import * as SI from "seamless-immutable"
import {
  FlowTab,
  FlowInstance,
  Processor,
  Entity,
  EntityType
} from "../model/flow.model"
import { initialAppState } from "./state"
import { Visibility } from "./ui.state.store"

export const SELECT_ENTITY = "SELECT_ENTITY"
export const SELECT_PROCESSOR_TO_CONNECT = "SELECT_PROCESSOR_TO_CONNECT"

export const ADD_FLOW_TABS = "ADD_FLOW_TABS"
export const REMOVE_FLOW_TAB = "REMOVE_FLOW_TAB"
export const SELECT_FLOW_TAB = "SELECT_FLOW_TAB"

export const SELECT_FLOW_INSTANCE = "SELECT_FLOW_INSTANCE"
export const UPDATE_FLOW_INSTANCE = "UPDATE_FLOW_INSTANCE"
export const UPDATE_FLOW_INSTANCE_STATE = "UPDATE_FLOW_INSTANCE_STATE"

export const UPDATE_SELECTED_PROCESSOR = "UPDATE_SELECTED_PROCESSOR"
export const UPDATE_CURRENT_PROCESSOR_PROPERTIES =
  "UPDATE_CURRENT_PROCESSOR_PROPERTIES"

export const UPDATE_SELECTED_FLOW_ENTITY_CONF =
  "UPDATE_SELECTED_FLOW_ENTITY_CONF"
export const CLEAR_FLOW_ENTITY_CONF = "CLEAR_FLOW_ENTITY_CONF"

export const SET_CONNECT_MODE = "SET_CONNECT_MODE"

export const UPDATE_PROCESSOR_PROPERTIES_DIALOG_VISIBILITY =
  "UPDATE_PROCESSOR_PROPERTIES_DIALOG_VISIBILITY"

export const NEW_MODAL_MESSAGE = "NEW_MODAL_MESSAGE"

export const ADD_CONTEXT_MENU_ITEMS = "ADD_CONTEXT_MENU_ITEMS"
export const REMOVE_CONTEXT_MENU_ITEMS = "REMOVE_CONTEXT_MENU_ITEMS"

export const ADD_CONTEXT_BAR_ITEMS = "ADD_CONTEXT_BAR_ITEMS"
export const REMOVE_CONTEXT_BAR_ITEMS = "REMOVE_CONTEXT_BAR_ITEMS"

export class AppAction implements Action {
  type: string
  payload: any
  constructor(type: string, payload: any) {
    this.type = type
    this.payload = payload
  }
}

export function flowTabs(
  state: FlowTab[] = SI.from(initialAppState.flowTabs),
  action: AppAction
): FlowTab[] {
  switch (action.type) {
    case ADD_FLOW_TABS:
      const withFlowTabs = state.concat(SI.from(action.payload.flowTabs))
      const selectedFlowTab = withFlowTabs[withFlowTabs.length - 1]
      let count = 0
      return withFlowTabs.map((ft: FlowTab) => {
        const title = "#" + (count + 1)
        count = count + 1
        const active = ft.id === selectedFlowTab.id
        return SI.from(ft).merge({ active: active, title: title })
      })
    case REMOVE_FLOW_TAB:
      const updatedState = state.filter(
        ft => ft.id !== action.payload.flowTabId
      )
      if (updatedState.length > 0) {
        let selectedIndex = 0
        if (action.payload.index === 0) selectedIndex = 0
        else selectedIndex = action.payload.index - 1
        return flowTabs(updatedState, {
          type: SELECT_FLOW_TAB,
          payload: { flowTab: updatedState[selectedIndex] }
        })
      } else return updatedState
    case UPDATE_FLOW_INSTANCE:
      return state.map(ft => {
        if (ft.flowInstance.id === action.payload.flowInstance.id)
          return SI.from(ft).set("flowInstance", action.payload.flowInstance)
        else return ft
      })
    case UPDATE_FLOW_INSTANCE_STATE:
      return state.map(ft => {
        if (ft.flowInstance.id === action.payload.flowInstanceId)
          return SI.from(ft).set(
            "flowInstance",
            flowInstance(ft.flowInstance, action)
          )
        else return ft
      })
    case SELECT_FLOW_TAB:
      return state.map((ft: FlowTab) => {
        if (ft.id !== action.payload.flowTab.id) {
          return SI.from(ft).set("active", false)
        } else {
          return SI.from(ft).set("active", true)
        }
      })
    case UPDATE_SELECTED_PROCESSOR:
      const activeFlowTab = SI.from(state.find(ft => ft.active))
      const updatedFlowInstance: FlowInstance = flowInstance(
        activeFlowTab.flowInstance,
        action
      )
      const updatedActiveFlowTab: FlowTab = activeFlowTab.set(
        "flowInstance",
        updatedFlowInstance
      ) as FlowTab
      return SI.from(state).map(ft => {
        if (ft.active) return updatedActiveFlowTab
        else return ft
      })
    default:
      return state
  }
}

export function flowInstance(
  state: FlowInstance,
  action: AppAction
): FlowInstance {
  switch (action.type) {
    case SELECT_FLOW_INSTANCE:
      return SI.from(action.payload.flowInstance)
    case UPDATE_FLOW_INSTANCE_STATE:
      return SI.from(state).set("state", action.payload.state)
    case UPDATE_SELECTED_PROCESSOR:
      return SI.from(state).set(
        "processors",
        processors(state.processors, action)
      )
    default:
      return state
  }
}

export function processors(state: Processor[] = [], action: AppAction) {
  state = state.slice(0)
  switch (action.type) {
    case UPDATE_SELECTED_PROCESSOR:
      if (state !== undefined)
        return state.map((p: Processor) => {
          if (p.id === action.payload.processor.id) {
            const pr: Processor = SI.from(action.payload.processor).asMutable()
            return pr
          } else return p
        })
      return state
    default:
      return state
  }
}

export function selectedEntity(
  state = { id: "", type: EntityType.UNKNOWN },
  action: AppAction
) {
  switch (action.type) {
    case SELECT_ENTITY:
      return action.payload
    default:
      return state
  }
}

export function processorToConnectId(state = "", action: AppAction) {
  switch (action.type) {
    case SELECT_PROCESSOR_TO_CONNECT:
      return action.payload.id
    default:
      return state
  }
}

export function currentProcessorProperties(state: any, action: AppAction) {
  switch (action.type) {
    case UPDATE_CURRENT_PROCESSOR_PROPERTIES:
      return action.payload.properties
    default:
      return state
  }
}

export function visibility(
  state: Visibility = new Visibility(),
  action: AppAction
): Visibility {
  const newState = SI.from(state)
  switch (action.type) {
    case UPDATE_PROCESSOR_PROPERTIES_DIALOG_VISIBILITY:
      return newState.merge({
        isProcessorPropertiesDialogVisible: action.payload
      })

    default:
      return state
  }
}

export function modalMessage(
  state: ModalMessage = initialAppState.modalMessage,
  action: AppAction
): ModalMessage {
  switch (action.type) {
    case NEW_MODAL_MESSAGE:
      return action.payload
    default:
      return state
  }
}

export function selectedFlowEntityConf(
  state: FlowEntityConf = initialAppState.selectedFlowEntityConf,
  action: AppAction
) {
  switch (action.type) {
    case UPDATE_SELECTED_FLOW_ENTITY_CONF:
      return action.payload.flowEntityConf
    case CLEAR_FLOW_ENTITY_CONF:
      return undefined
    default:
      return state
  }
}

export function connectMode(state: boolean = false, action: AppAction) {
  switch (action.type) {
    case SET_CONNECT_MODE:
      return action.payload
    default:
      return state
  }
}

export function contextMenuItems(
  state: Map<string, ContextMenuItem[]> = initialAppState.contextMenuItems,
  action: AppAction
) {
  const newState = state
  switch (action.type) {
    case ADD_CONTEXT_MENU_ITEMS:
      if (newState.has(action.payload.key)) {
        const items = newState.get(action.payload.key)
        items.push(...action.payload.items)
      } else {
        newState.set(action.payload.key, action.payload.items)
      }
      return newState
    case REMOVE_CONTEXT_MENU_ITEMS:
      if (newState.has(action.payload.key)) {
        const items = newState.get(action.payload.key)
        items.forEach(item => {
          const index = items.indexOf(item)
          items.splice(index, 1)
        })
      }
      return newState
    default:
      return state
  }
}

export function contextBarItems(
  state: Map<string, ContextBarItem[]> = initialAppState.contextBarItems,
  action: AppAction
) {
  const newState = state
  switch (action.type) {
    case ADD_CONTEXT_BAR_ITEMS:
      if (newState.has(action.payload.key)) {
        const items = newState.get(action.payload.key)
        items.push(...action.payload.items)
      } else {
        newState.set(action.payload.key, action.payload.items)
      }
      return newState
    case REMOVE_CONTEXT_BAR_ITEMS:
      if (newState.has(action.payload.key)) {
        const items = newState.get(action.payload.key)
        items.forEach(item => {
          const index = items.indexOf(item)
          items.splice(index, 1)
        })
      }
      return newState
    default:
      return state
  }
}

export const rootReducer = {
  flowTabs,
  selectedEntity,
  processorToConnectId,
  currentProcessorProperties,
  selectedFlowEntityConf,
  connectMode,
  visibility,
  contextMenuItems,
  contextBarItems
}

export function withParent<T>(
  parentReducer: ActionReducer<T>,
  reducer: ActionReducer<T>
) {
  return function parentChildReducer(state: T, action: Action) {
    return reducer(parentReducer(state, action), action)
  }
}
