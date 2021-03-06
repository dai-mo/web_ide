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
import {
  Connection,
  FlowComponent,
  FlowTab,
  EntityType,
  Processor,
  Entity
} from "./../model/flow.model"
import { Observable } from "rxjs/Observable"
import "rxjs/add/operator/take"

import { Injectable, NgZone } from "@angular/core"

import { Action, Store } from "@ngrx/store"

import { ImmutableArray, ImmutableObject } from "seamless-immutable"
import * as SI from "seamless-immutable"

// import { ContextBarItem, UiId, FlowEntityConf } from "./ui.models"
import { AppAction } from "./reducers"
import { Visibility } from "./ui.state.store"
import { FlowEntityConf } from "./fields"
import {
  ContextBarItem,
  UiId,
  ModalMessage,
  ContextMenuItem
} from "./ui.models"

/**
 * Created by cmathew on 01.07.17.
 */

@Injectable()
export class ObservableState {
  selectedEntity: Observable<Entity>

  constructor(private store: Store<AppState>, private ngZone: NgZone) {
    this.selectedEntity = this.store.select("selectedEntity")
  }

  appState(): AppState {
    let state: AppState = initialAppState

    this.store.take(1).subscribe((s: AppState) => (state = s))

    // You can always rely on subscribe()
    // running synchronously if you have
    // to get the state value
    return state
  }

  appStore(): Store<AppState> {
    return this.store
  }

  dispatch(action: AppAction) {
    return this.ngZone.run(() => this.store.dispatch(action))
  }

  selectedProcessor(): Processor {
    return this.activeFlowTab().flowInstance.processors.find(
      (p: Processor) => p.id === this.appState().selectedEntity.id
    )
  }

  processorToConnect(): Processor {
    return this.activeFlowTab().flowInstance.processors.find(
      (p: Processor) => p.id === this.appState().processorToConnectId
    )
  }

  selectedProcessor$(): Observable<Processor> {
    return this.activeFlowTab$().map(ft => {
      if (ft === undefined) return undefined
      else
        return ft.flowInstance.processors.find(
          (p: Processor) => p.id === this.appState().selectedEntity.id
        )
    })
  }

  selectedProcessorId$(): Observable<string> {
    return this.selectedProcessor$().map(sp => {
      if (sp === undefined) return undefined
      else return sp.id
    })
  }

  connectionsForSourceProcessor(processorId: string): Connection[] {
    return this.activeFlowTab().flowInstance.connections.filter(
      (c: Connection) =>
        c.config.source.componentType === FlowComponent.ProcessorType &&
        c.config.source.id === processorId
    )
  }

  selectedConnection(): Connection {
    return this.activeFlowTab().flowInstance.connections.find(
      (c: Connection) => c.id === this.appState().selectedEntity.id
    )
  }

  processor(processorId: string): Processor {
    return this.activeFlowTab().flowInstance.processors.find(
      (p: Processor) => p.id === processorId
    )
  }

  flowTabs$(): Observable<FlowTab[]> {
    return this.appStore().select((state: AppState) => state.flowTabs)
  }

  activeFlowTab(): FlowTab {
    return this.appState().flowTabs.find(ft => ft.active)
  }

  activeFlowTab$(): Observable<FlowTab> {
    return this.appStore()
      .select(state => state.flowTabs)
      .map(fts => fts.find(ft => ft.active))
  }

  modalMessage$(): Observable<ModalMessage> {
    return this.appStore().select(state => state.modalMessage)
  }

  hideContextBarItem(cbItem: ContextBarItem): Observable<boolean> {
    return this.selectedEntity.map((se: Entity) => {
      switch (cbItem.view) {
        case UiId.ANALYSE:
          return cbItem.entityType !== se.type
        default:
          return false
      }
    })
  }

  connectMode(): boolean {
    return this.appState().connectMode
  }

  connectMode$(): Observable<boolean> {
    return this.appStore().select((state: AppState) => state.connectMode)
  }

  visibility(): Visibility {
    return this.appState().visibility
  }

  selectedFlowEntityConf$(): Observable<FlowEntityConf> {
    return this.appStore().select(
      (state: AppState) => state.selectedFlowEntityConf
    )
  }

  contextMenuItems$(key: string): Observable<ContextMenuItem[]> {
    return this.appStore().select((state: AppState) =>
      state.contextMenuItems.get(key)
    )
  }

  contextBarItems$(key: string): Observable<ContextBarItem[]> {
    return this.appStore().select((state: AppState) =>
      state.contextBarItems.get(key)
    )
  }

  updateAnalyseContextItems(processorId: string) {
    return this.appState()
      .contextBarItems.get(UiId.ANALYSE)
      .forEach(cbItem => {
        if (cbItem.entityType === EntityType.PROCESSOR)
          if (processorId === "") cbItem.hidden = true
          else cbItem.hidden = false
        else {
          if (processorId === "") cbItem.hidden = false
          else cbItem.hidden = true
        }
      })
  }
}

export interface AppState {
  flowTabs: FlowTab[]
  selectedEntity: Entity
  processorToConnectId: string
  currentProcessorProperties: any
  selectedFlowEntityConf: FlowEntityConf
  connectMode: boolean
  visibility: Visibility
  modalMessage: ModalMessage
  contextMenuItems: Map<string, ContextMenuItem[]>
  contextBarItems: Map<string, ContextBarItem[]>
}

export const initialAppState: AppState = {
  flowTabs: [],
  selectedEntity: { id: "", type: EntityType.UNKNOWN },
  processorToConnectId: "",
  currentProcessorProperties: undefined,
  selectedFlowEntityConf: undefined,
  connectMode: false,
  visibility: new Visibility(),
  modalMessage: new ModalMessage(false, "", "", false),
  contextMenuItems: new Map<string, ContextMenuItem[]>(),
  contextBarItems: new Map<string, ContextBarItem[]>()
}
