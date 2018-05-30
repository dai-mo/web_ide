import { SchemaPropertyComponent } from "./../../panel/schema-property/schema-property.component"
import { MessageService } from "primeng/components/common/messageservice"
import { Component, Input, OnInit } from "@angular/core"
import {
  CoreProperties,
  DCSError,
  EntityType,
  FlowInstance,
  FlowInstantiation,
  FlowTab,
  ProcessorDetails,
  ProcessorServiceDefinition,
  PropertyDefinition
} from "../../model/flow.model"
import { FlowService } from "../service/flow.service"
import { ErrorService } from "../../service/error.service"
import { KeycloakService } from "../../service/keycloak.service"
import { UIStateStore } from "../../state/ui.state.store"

import { ContextBarItem, ContextMenuItem, UiId } from "../../state/ui.models"
import { FlowEntityConf } from "../../state/fields"
import { NotificationService } from "../../service/notification.service"
import { AppState, ObservableState } from "../../state/state"
import {
  ADD_FLOW_TABS,
  REMOVE_FLOW_TAB,
  SELECT_ENTITY,
  SELECT_FLOW_TAB,
  SET_CONNECT_MODE,
  UPDATE_FLOW_INSTANCE,
  UPDATE_FLOW_INSTANCE_STATE,
  UPDATE_SELECTED_FLOW_ENTITY_CONF,
  ADD_CONTEXT_BAR_ITEMS,
  UPDATE_PROCESSOR_PROPERTIES_DIALOG_VISIBILITY
} from "../../state/reducers"
import { ProcessorService } from "../../service/processor.service"
import { Observable } from "rxjs/Observable"
import { UIUtils, FlowUtils } from "../../util/ui.utils"
import { ConnectionService } from "../service/connection.service"
import { ProcessorProperties } from "../../state/item-conf/processor-properties"
import { ProcessorInfo } from "../../state/item-conf/processor-info"
import { ProcessorList } from "../../state/item-conf/processor-list"
import { DynamicItem } from "@blang/properties"
import { DynamicPanelComponent } from "../../panel/dynamic-panel/dynamic-panel.component"

@Component({
  selector: "abk-flow-tabs",
  templateUrl: "./flow-tabs.component.html",
  styleUrls: ["./flow-tabs.component.scss"]
})
export class FlowTabsComponent implements OnInit {
  public nifiUrl: string
  flowCMItems: ContextMenuItem[]

  emptyTab: FlowTab

  public dynamicItem: DynamicItem

  private stopFlowBarItem: ContextBarItem
  private startFlowBarItem: ContextBarItem

  flowTabs: Observable<FlowTab[]> = this.oss
    .appStore()
    .select((state: AppState) => state.flowTabs)

  constructor(
    private flowService: FlowService,
    private errorService: ErrorService,
    private notificationService: NotificationService,
    public oss: ObservableState,
    public uiStateStore: UIStateStore,
    private processorService: ProcessorService,
    private connectionService: ConnectionService,
    private messageService: MessageService
  ) {
    this.nifiUrl =
      window.location.protocol + "//" + window.location.host + "/nifi"

    this.flowCMItems = [
      { label: "Start Flow" },
      { label: "Stop Flow" },
      { label: "Delete Flow" }
    ]
    this.dynamicItem = new DynamicItem(DynamicPanelComponent)
  }

  public isRunning(flowTab: FlowTab) {
    return flowTab.flowInstance.state === FlowInstance.stateRunning
  }

  public isStopped(flowTab: FlowTab) {
    return flowTab.flowInstance.state === FlowInstance.stateStopped
  }

  public isNotStarted(flowTab: FlowTab) {
    return flowTab.flowInstance.state === FlowInstance.stateNotStarted
  }

  public activeTab(): FlowTab {
    return this.oss.appState().flowTabs.find(ft => ft.active)
  }

  public selectActiveTab(index: number): void {
    const at = this.oss.appState().flowTabs[index]
    if (at) this.setActiveTab(at)
  }

  public setActiveTab(flowTab: FlowTab): void {
    this.oss.dispatch({
      type: SELECT_FLOW_TAB,
      payload: { flowTab: flowTab }
    })

    this.oss.dispatch({
      type: SELECT_ENTITY,
      payload: {
        id: this.oss.activeFlowTab().flowInstance.id,
        type: EntityType.FLOW_INSTANCE
      }
    })

    this.updateContextBarItems(flowTab)
  }

  updateContextBarItems(flowTab: FlowTab) {
    this.stopFlowBarItem.enabled = this.isRunning(flowTab)
    this.startFlowBarItem.enabled = !this.isRunning(flowTab)
  }

  updateStopStartBarItems(isRunning: boolean) {
    this.stopFlowBarItem.enabled = isRunning
    this.startFlowBarItem.enabled = !isRunning
  }

  public toggleTabLabel(flowTab: FlowTab) {
    flowTab.labelToggle = !flowTab.labelToggle
  }

  public tabLabel(flowTab: FlowTab): string {
    if (flowTab.labelToggle) return flowTab.flowInstance.nameId
    else return flowTab.flowInstance.name
  }

  private addFlowInstance(flowInstance: FlowInstance) {
    if (flowInstance) {
      const tab = UIUtils.toFlowTab(flowInstance)
      this.addFlowTabs([tab])
    }
  }

  private addFlowTabs(flowTabs: FlowTab[]) {
    if (flowTabs !== undefined && flowTabs.length > 0) {
      this.oss.dispatch({
        type: ADD_FLOW_TABS,
        payload: { flowTabs: flowTabs }
      })
    }
  }

  @Input()
  set instantiateFlow(flowCreation: FlowInstantiation) {
    if (flowCreation.id) {
      if (flowCreation.id === "") {
        // do nothing
      } else {
        this.instantiateTemplate(flowCreation)
      }
    }
  }

  private instantiateTemplate(flowCreation: FlowInstantiation): void {
    KeycloakService.withTokenUpdate(
      function(rpt: string) {
        this.flowService.instantiateTemplate(flowCreation.id, rpt).subscribe(
          (flowInstance: FlowInstance) => {
            this.addFlowInstance(flowInstance)
            this.oss.dispatch({
              type: SELECT_ENTITY,
              payload: {
                id: flowInstance.id,
                type: EntityType.FLOW_INSTANCE
              }
            })
          },
          (error: any) => {
            this.errorService.handleError(error)
            const dcsError: DCSError = error.json()
            this.dialog.show(dcsError.message, dcsError.errorMessage)
          }
        )
      }.bind(this)
    )
  }

  public deleteTab(flowTab: FlowTab) {
    KeycloakService.withTokenUpdate(
      function(rpt: string) {
        this.flowService
          .destroyInstance(
            flowTab.id,
            FlowInstance.hasExternal(flowTab.flowInstance),
            rpt,
            flowTab.flowInstance.version
          )
          .subscribe(
            (deleteOK: boolean) => {
              if (!deleteOK) alert("Flow Instance could not be deleted")
              else {
                const flowTabs = this.oss.appState().flowTabs
                const flowTabIndex = flowTabs.indexOf(flowTab)
                this.oss.dispatch({
                  type: REMOVE_FLOW_TAB,
                  payload: {
                    flowTabId: flowTab.id,
                    index: flowTabIndex
                  }
                })
              }
            },
            (error: any) => this.errorService.handleError(error)
          )
      }.bind(this)
    )
  }

  public startFlow(flowTab: FlowTab) {
    if (flowTab) {
      this.flowService.startInstance(flowTab.id).subscribe(
        startOK => {
          if (startOK) {
            this.oss.dispatch({
              type: UPDATE_FLOW_INSTANCE_STATE,
              payload: {
                flowInstanceId: flowTab.flowInstance.id,
                state: FlowInstance.stateRunning
              }
            })
            this.updateStopStartBarItems(true)
          } else alert("Flow Instance failed to start")
        },
        (error: any) => this.errorService.handleError(error)
      )
    }
  }

  public refreshFlow(flowTab: FlowTab) {
    if (flowTab) {
      this.flowService.instance(flowTab.id).subscribe(
        (flowInstance: FlowInstance) => {
          this.oss.dispatch({
            type: UPDATE_FLOW_INSTANCE,
            payload: {
              flowInstance: flowInstance
            }
          })
          this.updateContextBarItems(flowTab)
        },
        (error: any) => this.errorService.handleError(error)
      )
    }
  }

  public stopFlow(flowTab: FlowTab) {
    if (flowTab) {
      this.flowService.stopInstance(flowTab.id).subscribe(
        stopOK => {
          if (stopOK) {
            this.oss.dispatch({
              type: UPDATE_FLOW_INSTANCE_STATE,
              payload: {
                flowInstanceId: flowTab.flowInstance.id,
                state: FlowInstance.stateStopped
              }
            })
            this.updateStopStartBarItems(false)
          } else alert("Flow Instance failed to stop")
        },
        (error: any) => this.errorService.handleError(error)
      )
    }
  }

  showProcessorPropertiesDialog() {
    const sp = this.oss.selectedProcessor()

    if (sp !== undefined) {
      this.processorService
        .properties(FlowUtils.processorServiceClassName(sp))
        .subscribe((propertyDefinitions: PropertyDefinition[]) => {
          const ppc = new ProcessorProperties(
            sp,
            propertyDefinitions,
            this.oss,
            this.processorService,
            this.flowService,
            this.uiStateStore,
            this.errorService,
            this.notificationService,
            this.messageService
          )

          if (!ppc.hasItems()) {
            this.oss.dispatch({
              type: UPDATE_PROCESSOR_PROPERTIES_DIALOG_VISIBILITY,
              payload: false
            })
            this.notificationService.warn({
              title: "Processor Properties",
              description: "No configurable properties for chosen processor"
            })
          } else {
            this.oss.dispatch({
              type: UPDATE_SELECTED_FLOW_ENTITY_CONF,
              payload: { flowEntityConf: ppc }
            })
            this.oss.dispatch({
              type: UPDATE_PROCESSOR_PROPERTIES_DIALOG_VISIBILITY,
              payload: true
            })
          }
        })
    }
  }

  showProcessorConfDialog() {
    this.processorService.list().subscribe(
      (defs: ProcessorServiceDefinition[]) => {
        const processorConf = new ProcessorList(
          defs,
          this.oss,
          this.uiStateStore,
          this.flowService,
          this.processorService,
          this.errorService
        )
        this.oss.dispatch({
          type: UPDATE_SELECTED_FLOW_ENTITY_CONF,
          payload: { flowEntityConf: processorConf }
        })
        this.uiStateStore.isProcessorConfDialogVisible = true
      },
      (error: any) => {
        this.errorService.handleError(error)
      }
    )
  }

  showProcessorInfoDialog() {
    const processorServiceClassName = this.oss.selectedProcessor().properties[
      CoreProperties._PROCESSOR_CLASS
    ]
    this.processorService
      .details(processorServiceClassName)
      .subscribe((processorDetails: ProcessorDetails) => {
        const processorInfo = new ProcessorInfo(
          processorServiceClassName,
          processorDetails,
          this.uiStateStore
        )
        this.oss.dispatch({
          type: UPDATE_SELECTED_FLOW_ENTITY_CONF,
          payload: { flowEntityConf: processorInfo }
        })
        this.uiStateStore.isProcessorInfoDialogVisible = true
      })
  }

  showRelationshipsInfoDialog() {
    this.uiStateStore.isRelationshipsInfoDialogVisible = true
  }

  deleteSelectedProcessor() {
    const sp = this.oss.selectedProcessor()
    this.processorService
      .destroy(
        sp.id,
        this.oss.activeFlowTab().flowInstance.id,
        sp.processorType,
        sp.version
      )
      .subscribe(
        (deleteOk: boolean) => {
          if (deleteOk) {
            this.oss.dispatch({
              type: SELECT_ENTITY,
              payload: {
                id: this.oss.activeFlowTab().flowInstance.id,
                type: EntityType.FLOW_INSTANCE
              }
            })
            this.flowService
              .instance(this.oss.activeFlowTab().flowInstance.id)
              .subscribe(
                (flowInstance: FlowInstance) => {
                  this.oss.dispatch({
                    type: UPDATE_FLOW_INSTANCE,
                    payload: {
                      flowInstance: flowInstance
                    }
                  })
                },
                (error: any) => {
                  this.errorService.handleError(error)
                }
              )
          }
        },
        (error: any) => {
          this.errorService.handleError(error)
        }
      )
  }

  deleteSelectedConnection() {
    const sc = this.oss.selectedConnection()
    this.connectionService.remove(sc).subscribe(
      (deleteOk: boolean) => {
        if (deleteOk)
          this.flowService
            .instance(this.oss.activeFlowTab().flowInstance.id)
            .subscribe(
              (flowInstance: FlowInstance) => {
                this.oss.dispatch({
                  type: UPDATE_FLOW_INSTANCE,
                  payload: {
                    flowInstance: flowInstance
                  }
                })
              },
              (error: any) => {
                this.errorService.handleError(error)
              }
            )
      },
      (error: any) => {
        this.errorService.handleError(error)
      }
    )
  }

  toggleConnectMode() {
    this.oss.dispatch({
      type: SET_CONNECT_MODE,
      payload: !this.oss.connectMode()
    })
  }

  ngOnInit() {
    KeycloakService.withTokenUpdate(
      function(rpt: string) {
        this.flowService.instances(rpt).subscribe(
          (instances: Array<FlowInstance>) => {
            const flowTabs: FlowTab[] = instances.map(
              (flowInstance: FlowInstance) => {
                return UIUtils.toFlowTab(flowInstance)
              }
            )

            this.addFlowTabs(flowTabs)

            if (flowTabs.length > 0)
              this.oss.dispatch({
                type: SELECT_ENTITY,
                payload: {
                  id: this.oss.activeFlowTab().flowInstance.id,
                  type: EntityType.FLOW_INSTANCE
                }
              })
          },
          (error: any) => this.errorService.handleError(error)
        )
      }.bind(this)
    )

    this.stopFlowBarItem = {
      view: UiId.ANALYSE,
      entityType: EntityType.FLOW_INSTANCE,
      iconClass: "fa-stop",
      enabled: false,
      hidden: false,
      command: event => {
        this.stopFlow(this.activeTab())
      }
    }
    this.startFlowBarItem = {
      view: UiId.ANALYSE,
      entityType: EntityType.FLOW_INSTANCE,
      iconClass: "fa-play",
      enabled: true,
      hidden: false,
      command: event => {
        this.startFlow(this.activeTab())
      }
    }

    const cbItems: ContextBarItem[] = [
      {
        view: UiId.ANALYSE,
        entityType: EntityType.FLOW_INSTANCE,
        iconClass: "fa-trash",
        enabled: true,
        hidden: false,
        command: event => {
          this.deleteTab(this.activeTab())
        }
      },
      {
        view: UiId.ANALYSE,
        entityType: EntityType.FLOW_INSTANCE,
        iconClass: "fa-plus-circle",
        enabled: true,
        hidden: false,
        command: event => {
          this.showProcessorConfDialog()
        }
      },
      this.stopFlowBarItem,
      this.startFlowBarItem,
      {
        view: UiId.ANALYSE,
        entityType: EntityType.FLOW_INSTANCE,
        iconClass: "fa-refresh",
        enabled: true,
        hidden: false,
        command: event => {
          this.refreshFlow(this.activeTab())
        }
      },
      {
        view: UiId.ANALYSE,
        entityType: EntityType.FLOW_INSTANCE,
        iconClass: "fa-plug",
        enabled: true,
        hidden: false,
        command: event => {
          this.toggleConnectMode()
        }
      },
      {
        view: UiId.ANALYSE,
        entityType: EntityType.PROCESSOR,
        iconClass: "fa-trash",
        enabled: true,
        hidden: false,
        command: event => {
          this.deleteSelectedProcessor()
        }
      },
      {
        view: UiId.ANALYSE,
        entityType: EntityType.PROCESSOR,
        iconClass: "fa-link",
        enabled: true,
        hidden: false,
        command: event => {
          this.showRelationshipsInfoDialog()
        }
      },
      {
        view: UiId.ANALYSE,
        entityType: EntityType.PROCESSOR,
        iconClass: "fa-list-alt",
        enabled: true,
        hidden: true,
        command: () => {
          this.uiStateStore.isProcessorSchemaDialogVisible = true
        }
      },
      {
        view: UiId.ANALYSE,
        entityType: EntityType.PROCESSOR,
        iconClass: "fa-cogs",
        enabled: true,
        hidden: true,
        command: () => {
          this.showProcessorPropertiesDialog()
        }
      },
      {
        view: UiId.ANALYSE,
        entityType: EntityType.PROCESSOR,
        iconClass: "fa-info",
        enabled: true,
        hidden: true,
        command: () => {
          this.showProcessorInfoDialog()
        }
      },
      {
        view: UiId.ANALYSE,
        entityType: EntityType.PROCESSOR,
        iconClass: "fa-plug",
        enabled: true,
        hidden: false,
        command: event => {
          this.toggleConnectMode()
        }
      },
      {
        view: UiId.ANALYSE,
        entityType: EntityType.CONNECTION,
        iconClass: "fa-trash",
        enabled: true,
        hidden: false,
        command: event => {
          this.deleteSelectedConnection()
        }
      },
      {
        view: UiId.ANALYSE,
        entityType: EntityType.CONNECTION,
        iconClass: "fa-plug",
        enabled: true,
        hidden: false,
        command: event => {
          this.toggleConnectMode()
        }
      }
    ]

    this.oss.dispatch({
      type: ADD_CONTEXT_BAR_ITEMS,
      payload: {
        key: UiId.ANALYSE,
        items: cbItems
      }
    })
  }
}
