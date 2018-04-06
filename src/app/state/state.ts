import {Observable} from "rxjs/Rx"
import {Injectable, NgZone} from "@angular/core"
import {FlowComponent, Connection, Entity, EntityType, FlowInstance, FlowTab, Processor} from "../analyse/flow.model"
import {Action, Store} from "@ngrx/store"
import {ContextBarItem, FlowEntityConf, UiId, Visibility} from "../shared/ui.models"
import {ImmutableArray, ImmutableObject} from "seamless-immutable"
import * as SI from "seamless-immutable"
import {isNullOrUndefined} from "util"

/**
 * Created by cmathew on 01.07.17.
 */

@Injectable()
export class ObservableState {

  selectedEntity: Observable<Entity>

  constructor(private store:Store<AppState>,
              private ngZone: NgZone) {
    this.selectedEntity = this.store.select("selectedEntity")
  }

  appState(): AppState {

    let state: AppState

    this.store.take(1).subscribe((s: AppState) => state = s)

    // You can always rely on subscribe()
    // running synchronously if you have
    // to get the state value
    return state
  }

  appStore(): Store<AppState> {
    return this.store
  }

  dispatch(action: Action) {
    return  this.ngZone.run(() => this.store.dispatch(action))
  }

  selectedProcessor(): Processor {
    return this.activeFlowTab().flowInstance.processors
      .find(p => p.id === this.appState().selectedEntity.id)
  }

  processorToConnect(): Processor {
    return this.activeFlowTab().flowInstance.processors
      .find(p => p.id === this.appState().processorToConnectId)
  }

  selectedProcessor$(): Observable<Processor> {
    return this.activeFlowTab$()
      .map(ft => {
          if (ft === undefined)
            return undefined
          else
            return ft.flowInstance.processors
              .find(p => p.id === this.appState().selectedEntity.id)
        }
      )
  }

  selectedProcessorId$(): Observable<string> {
    return this.selectedProcessor$()
      .map(sp => {
          if (sp === undefined)
            return undefined
          else
            return sp.id
        }
      )
  }

  connectionsForSourceProcessor(processorId: string): Connection[] {
    return this.activeFlowTab()
      .flowInstance.connections.filter(
        c => c.config.source.componentType === FlowComponent.ProcessorType && c.config.source.id === processorId)
  }

  selectedConnection(): Connection {
    return this.activeFlowTab().flowInstance.connections
      .find(p => p.id === this.appState().selectedEntity.id)
  }

  processor(processorId: string): Processor {
    return this.activeFlowTab().flowInstance.processors.find(p => p.id === processorId)
  }

  activeFlowTab(): FlowTab {
    return this.appState().flowTabs.find(ft => ft.active)
  }

  activeFlowTab$(): Observable<FlowTab> {
    return this.appStore()
      .select(state => state.flowTabs)
      .map(fts => fts.find(ft => ft.active))
  }

  hideContextBarItem(cbItem: ContextBarItem): Observable<boolean> {
    return this.selectedEntity
      .map((se: Entity) => {
        switch(cbItem.view) {
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
}

export interface AppState {
  flowTabs: FlowTab[]
  selectedEntity: Entity
  processorToConnectId: string
  currentProcessorProperties: any
  selectedFlowEntityConf: FlowEntityConf
  connectMode: boolean
  visibility: Visibility
}

export const initialAppState: AppState = {
  flowTabs: [],
  selectedEntity: {id: "", type: EntityType.UNKNOWN},
  processorToConnectId: "",
  currentProcessorProperties: undefined,
  selectedFlowEntityConf: undefined,
  connectMode: false,
  visibility: new Visibility()
}

