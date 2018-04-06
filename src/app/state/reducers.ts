/**
 * Created by cmathew on 03.07.17.
 */

import {Entity, EntityType, FlowInstance, FlowTab, Processor} from "../analyse/flow.model"
import {Action, ActionReducer} from "@ngrx/store"
import * as SI from "seamless-immutable"
import {FlowEntityConf, Visibility} from "../shared/ui.models"


export const SELECT_ENTITY: string = "SELECT_ENTITY"
export const SELECT_PROCESSOR_TO_CONNECT: string = "SELECT_PROCESSOR_TO_CONNECT"

export const ADD_FLOW_TABS: string = "ADD_FLOW_TABS"
export const REMOVE_FLOW_TAB: string = "REMOVE_FLOW_TAB"
export const SELECT_FLOW_TAB: string = "SELECT_FLOW_TAB"

export const SELECT_FLOW_INSTANCE: string = "SELECT_FLOW_INSTANCE"
export const UPDATE_FLOW_INSTANCE: string = "UPDATE_FLOW_INSTANCE"
export const UPDATE_FLOW_INSTANCE_STATE: string = "UPDATE_FLOW_INSTANCE_STATE"

export const UPDATE_SELECTED_PROCESSOR: string = "UPDATE_SELECTED_PROCESSOR"
export const UPDATE_CURRENT_PROCESSOR_PROPERTIES: string = "UPDATE_CURRENT_PROCESSOR_PROPERTIES"

export const UPDATE_SELECTED_FLOW_ENTITY_CONF: string = "UPDATE_SELECTED_FLOW_ENTITY_CONF"
export const CLEAR_FLOW_ENTITY_CONF: string = "CLEAR_FLOW_ENTITY_CONF"

export const SET_CONNECT_MODE: string = "SET_CONNECT_MODE"

export const UPDATE_PROCESSOR_PROPERTIES_DIALOG_VISIBILITY: string = "UPDATE_PROCESSOR_PROPERTIES_DIALOG_VISIBILITY"


export const flowTabs: ActionReducer<FlowTab[]> =
  (state = SI.from([]), action: Action): FlowTab[] => {

    switch (action.type) {
      case ADD_FLOW_TABS:
        let withFlowTabs = state.concat(SI.from(action.payload.flowTabs))
        let selectedFlowTab = withFlowTabs[withFlowTabs.length - 1]
        let count = 0
        return withFlowTabs.map((ft: FlowTab) => {
          let title = "#" + (count + 1)
          count = count + 1
          let active = ft.id === selectedFlowTab.id
          return SI.from(ft).merge({active: active, title: title})
        })
      case REMOVE_FLOW_TAB:
        let updatedState = state.filter(ft => ft.id !== action.payload.flowTabId)
        if(updatedState.length > 0) {
          let selectedIndex = 0
          if(action.payload.index === 0)
            selectedIndex = 0
          else
            selectedIndex = action.payload.index - 1
          return flowTabs(updatedState, {
            type: SELECT_FLOW_TAB,
            payload: {flowTab: updatedState[selectedIndex]}
          })
        }
        else
          return updatedState
      case UPDATE_FLOW_INSTANCE:
        return state.map(ft => {
          if (ft.flowInstance.id === action.payload.flowInstance.id)
            return SI.from(ft).set("flowInstance", action.payload.flowInstance)
          else
            return ft
        })
      case UPDATE_FLOW_INSTANCE_STATE:
        return state.map(ft => {
          if(ft.flowInstance.id === action.payload.flowInstanceId)
            return SI.from(ft).set("flowInstance",  flowInstance(ft.flowInstance, action))
          else
            return ft
        })
      case SELECT_FLOW_TAB:
        return state.map((ft: FlowTab) => {
          if(ft.id !== action.payload.flowTab.id) {
            return SI.from(ft).set("active", false)
          } else {
            return SI.from(ft).set("active", true)
          }
        })
      case UPDATE_SELECTED_PROCESSOR:
        let activeFlowTab = SI.from(state.find(ft => ft.active))
        let updatedFlowInstance: FlowInstance = flowInstance(activeFlowTab.flowInstance, action)
        let updatedActiveFlowTab: FlowTab =
          activeFlowTab.set("flowInstance", updatedFlowInstance)
        return SI.from(state).map(ft => {
          if(ft.active)
            return updatedActiveFlowTab
          else
            return ft
        })
      default:
        return state
    }
  }

export const flowInstance: ActionReducer<FlowInstance> =
  (state = undefined, action: Action): FlowInstance => {
    switch (action.type) {
      case SELECT_FLOW_INSTANCE:
        return SI.from(action.payload.flowInstance)
      case UPDATE_FLOW_INSTANCE_STATE:
        return SI.from(state).set("state", action.payload.state)
      case UPDATE_SELECTED_PROCESSOR:
        return SI.from(state).set("processors", processors(state.processors, action))
      default:
        return state
    }
  }


export const processors: ActionReducer<Processor[]> =
  (state = [], action: Action) => {
    state = state.slice(0)
    switch (action.type) {
      case UPDATE_SELECTED_PROCESSOR:
        if(state !== undefined)
          return state.map((p: Processor) => {
            if (p.id === action.payload.processor.id) {
              let pr: Processor = SI.from(action.payload.processor).asMutable()
              return pr
            } else
              return p
          })
        return state
      default:
        return state
    }
  }

export const selectedEntity: ActionReducer<Entity> =
  (state = {id: "", type: EntityType.UNKNOWN}, action: Action) => {
    switch (action.type) {
      case SELECT_ENTITY:
        return action.payload
      default:
        return state
    }
  }

export const processorToConnectId: ActionReducer<string> =
  (state = "", action: Action) => {
    switch (action.type) {
      case SELECT_PROCESSOR_TO_CONNECT:
        return action.payload.id
      default:
        return state
    }
  }

export const currentProcessorProperties: ActionReducer<any> =
  (state = undefined, action: Action) => {
    switch (action.type) {
      case UPDATE_CURRENT_PROCESSOR_PROPERTIES:
        return action.payload.properties
      default:
        return state
    }
  }

export const visibility: ActionReducer<Visibility> =
  (state = new Visibility(), action: Action) => {
    let newState = SI.from(state)
    switch (action.type) {
      case UPDATE_PROCESSOR_PROPERTIES_DIALOG_VISIBILITY:
        return newState.merge({isProcessorPropertiesDialogVisible: action.payload})

      default:
        return state
    }
  }

export const selectedFlowEntityConf: ActionReducer<FlowEntityConf> =
  (state = undefined, action: Action) => {
    switch (action.type) {
      case UPDATE_SELECTED_FLOW_ENTITY_CONF:
        return action.payload.flowEntityConf
      case CLEAR_FLOW_ENTITY_CONF:
        return undefined
      default:
        return state
    }
  }

export const connectMode: ActionReducer<boolean> =
  (state = false, action: Action) => {
    switch (action.type) {
      case SET_CONNECT_MODE:
        return action.payload
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
  visibility
}


export function withParent<T>(parentReducer: ActionReducer<T>, reducer: ActionReducer<T> ) {
  return function parentChildReducer( state: T, action: Action ) {
    return reducer(parentReducer(state, action), action)
  }
}


