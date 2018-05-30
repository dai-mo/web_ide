import { Injectable, NgZone } from "@angular/core"
import { Observable } from "rxjs/Observable"
import {
  EntityType,
  FlowInstantiation,
  FlowInstance,
  FlowTab,
  Processor,
  Provenance,
  VisTab
} from "../model/flow.model"
import { Msg, MsgGroup, UiId, ViewsVisible } from "./ui.models"
import { ObservableState } from "../state/state"
import { BehaviorSubject } from "rxjs/BehaviorSubject"

// FIXME: All elements of this class related to application state should be moved to ObservableState
//        Only state related to the UI should remain here.

@Injectable()
export class UIStateStore {
  public store: {
    flowTabs: FlowTab[]
    visTabs: VisTab[]
  }

  private _resizeView: BehaviorSubject<MouseEvent> = new BehaviorSubject(null)
  resizeView: Observable<MouseEvent> = this._resizeView.asObservable()

  private _selectedProcessorId: BehaviorSubject<string> = new BehaviorSubject(
    null
  )

  selectedProcessorId: Observable<
    string
  > = this._selectedProcessorId.asObservable()
  private _selectedProcessor: BehaviorSubject<Processor> = new BehaviorSubject(
    null
  )

  selectedProcessor: Observable<
    Processor
  > = this._selectedProcessor.asObservable()

  private _viewsVisible: BehaviorSubject<ViewsVisible> = new BehaviorSubject(
    new ViewsVisible()
  )
  viewsVisible: Observable<ViewsVisible> = this._viewsVisible.asObservable()

  private _flowInstanceToAdd: BehaviorSubject<
    FlowInstance
  > = new BehaviorSubject(null)
  flowInstanceToAdd: Observable<
    FlowInstance
  > = this._flowInstanceToAdd.asObservable()

  private _flowTabs: BehaviorSubject<FlowTab[]> = new BehaviorSubject([])
  flowTabs: Observable<FlowTab[]> = this._flowTabs.asObservable()

  private _visTabs: BehaviorSubject<VisTab[]> = new BehaviorSubject([])

  visTabs: Observable<VisTab[]> = this._visTabs.asObservable()

  visTabsWoMap: Observable<VisTab[]> = this.visTabs.map(vts =>
    vts.filter((t: VisTab) => t.visType !== UiId.VIS_MAP)
  )

  mapVisTab: Observable<VisTab> = this.visTabs.map(vts =>
    vts.find((t: VisTab) => t.visType === UiId.VIS_MAP)
  )

  private _selectedVisType: BehaviorSubject<string> = new BehaviorSubject("")
  selectedVisType: Observable<string> = this._selectedVisType.asObservable()

  private _provenances: BehaviorSubject<Provenance[]> = new BehaviorSubject([])
  private _provenancesUpdated: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  )

  provenancesUpdated: Observable<
    boolean
  > = this._provenancesUpdated.asObservable()

  provenances = this._provenances.asObservable()

  private _flowInstantiation: BehaviorSubject<
    FlowInstantiation
  > = new BehaviorSubject({ id: undefined })
  flowInstantiationObs: Observable<
    FlowInstantiation
  > = this._flowInstantiation.asObservable()

  private _processorPropertiesToUpdate: BehaviorSubject<
    any
  > = new BehaviorSubject(undefined)
  processorPropertiesToUpdate: Observable<
    any
  > = this._processorPropertiesToUpdate.asObservable()

  public isTemplateInfoDialogVisible = false
  public isProcessorSchemaDialogVisible = false

  public isProcessorConfDialogVisible = false
  public isProcessorInfoDialogVisible = false
  public isFlowCreationDialogVisible = false
  public isRelationshipsInfoDialogVisible = false
  public isRelationshipsSettingsDialogVisible = false
  public isServerCheckSucessful = true

  private _displayMesssages: BehaviorSubject<MsgGroup> = new BehaviorSubject({
    messages: [],
    sticky: false,
    delay: 3000
  })
  public displayMesssages = this._displayMesssages.asObservable()

  private _isSchemaUpdatable: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  )
  isSchemaUpdatable = this._isSchemaUpdatable.asObservable()

  constructor(private ngZone: NgZone) {
    this.store = {
      flowTabs: [],
      visTabs: []
    }
  }

  setViewsVisible(viewsVisible: ViewsVisible) {
    this.ngZone.run(() => this._viewsVisible.next(viewsVisible))
  }

  makeViewVisible(view: string) {
    const vv = this._viewsVisible.getValue()
    switch (view) {
      case UiId.ANALYSE:
        vv.analyse = true
        break
      case UiId.MOBILISE:
        vv.mobilise = true
        break
      case UiId.VISUALISE:
        vv.visualise = true
        break
    }
    this.setViewsVisible(vv)
  }

  maximiseView(view: string) {
    const vv = new ViewsVisible()
    switch (view) {
      case UiId.ANALYSE:
        vv.mobilise = false
        vv.visualise = false
        vv.analyse = true
        break
      case UiId.MOBILISE:
        vv.analyse = false
        vv.visualise = false
        vv.mobilise = true
        break
      case UiId.VISUALISE:
        vv.analyse = false
        vv.mobilise = false
        vv.visualise = true
        break
    }
    this.setViewsVisible(vv)
  }

  setResizeView(event: any) {
    this.ngZone.run(() => this._resizeView.next(event))
  }

  setSelectedProcessorId(processorId: string) {
    // this.updateAnalyseContextItems(processorId)
    this.ngZone.run(() => this._selectedProcessorId.next(processorId))
    const selectedProcessor = this.getActiveFlowProcessor(processorId)
    this.ngZone.run(() => this._selectedProcessor.next(selectedProcessor))
  }

  getSelectedProcessorId(): string {
    return this._selectedProcessorId.getValue()
  }

  getSelectedProcessor(): Processor {
    return this._selectedProcessor.getValue()
  }

  // getSelectedProcessorPropertiesConf(): ProcessorPropertiesConf {
  //   let selectedProcessor = this._selectedProcessor.getValue()
  //   if (selectedProcessor !== null)
  //     return new ProcessorPropertiesConf(selectedProcessor, this.appStore, this.processorService, this.errorService)
  //   else
  //     return undefined
  // }

  getActiveFlowProcessor(processorId: string): Processor {
    if (processorId)
      return this.getActiveFlowTab().flowInstance.processors.find(p =>
        processorId.endsWith(p.id)
      )
    else return null
  }

  setFlowInstanceToAdd(flowInstance: FlowInstance) {
    this._flowInstanceToAdd.next(flowInstance)
  }

  getFlowTabs(): Array<FlowTab> {
    return this._flowTabs.getValue()
  }

  getActiveFlowTab(): FlowTab {
    return this._flowTabs.getValue().find(ft => ft.active)
  }

  addFlowTab(flowTab: FlowTab) {
    this.store.flowTabs.push(flowTab)
    this.ngZone.run(() => this._flowTabs.next(this.store.flowTabs))
  }

  removeFlowTab(flowTab: FlowTab) {
    this.store.flowTabs
      .filter((t: FlowTab) => t.id === flowTab.id)
      .forEach((t: FlowTab) =>
        this.store.flowTabs.splice(this.store.flowTabs.indexOf(flowTab), 1)
      )
    this.ngZone.run(() => this._flowTabs.next(this.store.flowTabs))
  }

  updateFlowTabs() {
    this.ngZone.run(() => this._flowTabs.next(this.store.flowTabs))
  }

  addFlowTabs(flowTabs: FlowTab[]) {
    this.store.flowTabs = flowTabs
    this.ngZone.run(() => this._flowTabs.next(this.store.flowTabs))
  }

  addVisTab(visTab: VisTab) {
    this.store.visTabs.push(visTab)
    this.ngZone.run(() => this._visTabs.next(this.store.visTabs))
  }

  removeVisTab(visTab: VisTab) {
    this.store.visTabs
      .filter((t: VisTab) => t.visType === visTab.visType)
      .forEach((t: VisTab) =>
        this.store.visTabs.splice(this.store.visTabs.indexOf(visTab), 1)
      )
    this.ngZone.run(() => this._visTabs.next(this.store.visTabs))
  }

  getVisTabs(): VisTab[] {
    return this._visTabs.getValue()
  }

  public setActiveVisTab(visTab: VisTab): void {
    visTab.active = true
    this.store.visTabs.forEach(t => {
      if (t !== visTab) t.active = false
    })
  }

  selectVisType(visType: string) {
    this.ngZone.run(() => this._selectedVisType.next(visType))
  }

  hasProvenances(): boolean {
    return this._provenances != null && this.getProvenances().length > 0
  }

  getProvenances(): Provenance[] {
    return this._provenances.getValue()
  }

  setProvenances(provenances: Provenance[]) {
    this.ngZone.run(() => this._provenances.next(provenances))
    const p = this.hasProvenances()
    this.ngZone.run(() => this._provenancesUpdated.next(p))
  }

  updateFlowInstantiationId(flowInstantiationId: string) {
    this.ngZone.run(() =>
      this._flowInstantiation.next({ id: flowInstantiationId })
    )
  }

  // --- Processor Properties Start

  setProcessorPropertiesToUpdate(properties: any) {
    this.ngZone.run(() => this._processorPropertiesToUpdate.next(properties))
  }

  // getProcessorPropertiesToUpdate(): any {
  //   return this.oss.appState().currentProcessorProperties
  //   // return this._processorPropertiesToUpdate.getValue()
  // }
  // --- Processor Properties End

  // --- Processor Schema State Start ---

  getSchemaUpdatable(): boolean {
    return this._isSchemaUpdatable.getValue()
  }
  setSchemaUpdatable(isSchemaUpdatable: boolean) {
    this.ngZone.run(() => this._isSchemaUpdatable.next(isSchemaUpdatable))
  }
  // --- Processor Schema State End ---

  // --- Messages State Start ---

  getDisplayMessages(): MsgGroup {
    return this._displayMesssages.getValue()
  }
  setDisplayMessages(msgGroup: MsgGroup) {
    this.ngZone.run(() => this._displayMesssages.next(msgGroup))
  }
  // --- Messages State End ---

  // ---- Dialog Flags Start ----

  setFlowCreationDialogVisible(isFlowCreationDialogVisible: boolean) {
    this.ngZone.run(
      () => (this.isFlowCreationDialogVisible = isFlowCreationDialogVisible)
    )
  }
  // ---- Dialog Flags End   ----
}

export class Visibility {
  isProcessorPropertiesDialogVisible = false
}
