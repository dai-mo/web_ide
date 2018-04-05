/**
 * Created by cmathew on 14/07/16.
 */
import {Component, OnInit} from "@angular/core"
import {FlowService} from "../service/flow.service"
import {ErrorService} from "../shared/util/error.service"
import {FlowTemplate} from "./flow.model"
import {UIStateStore} from "../shared/ui.state.store"
import {ContextMenuItem, FlowCreation, FlowEntityConf, TemplateInfo, UiId} from "../shared/ui.models"
import {ContextStore} from "../shared/context.store"
import {AppState, ObservableState} from "../store/state"
import {Observable} from "rxjs"
import {UPDATE_SELECTED_FLOW_ENTITY_CONF} from "../store/reducers"


@Component({
  selector: "analyse",
  templateUrl: "partials/analyse/view.html"
})
export class AnalyseComponent  implements OnInit {

  public status: { isopen:boolean } = { isopen: false }
  public templates: Array<any>

  selectedFlowEntityConf: Observable<FlowEntityConf> = this.oss.appStore().select((state: AppState) => state.selectedFlowEntityConf)

  constructor(private flowService: FlowService,
              private oss: ObservableState,
              private errorService: ErrorService,
              private uiStateStore: UIStateStore,
              private contextStore: ContextStore) {

  }

  getTemplates() {
    this.flowService
      .templates()
      .subscribe(
        templates => {
          this.templates = templates
          let templateEntityInfo = new TemplateInfo(templates, this.oss)
          this.oss.dispatch({
            type: UPDATE_SELECTED_FLOW_ENTITY_CONF,
            payload: {flowEntityConf:  templateEntityInfo}
          })
          this.uiStateStore.isTemplateInfoDialogVisible = true
        },
        (error: any) =>  {
          this.errorService.handleError(error)
        }
      )
  }

  ngOnInit() {
    let cmItems: ContextMenuItem[] = [
      {label: "Instantiate Flow", command: (event) => {
        this.showTemplateInfoDialog()
      }},
      {label: "Create Flow", command: (event) => {
        this.showFlowCreationDialog()
      }}
    ]
    this.contextStore.addContextMenu(UiId.ANALYSE, cmItems)
  }


  showTemplateInfoDialog() {
    this.getTemplates()
  }

  showFlowCreationDialog() {
    let flowCreation = new FlowCreation(this.oss, this.flowService, this.errorService)
    this.oss.dispatch({
      type: UPDATE_SELECTED_FLOW_ENTITY_CONF,
      payload: {flowEntityConf:  flowCreation}
    })
    this.uiStateStore.isFlowCreationDialogVisible = true
  }


  public toggleDropdown(event:MouseEvent):void {
    event.preventDefault()
    event.stopPropagation()
    this.status.isopen = !this.status.isopen
  }

  public selectTemplate(event: MouseEvent, flowTemplate: FlowTemplate): void {
    event.preventDefault()
    event.stopPropagation()
    this.status.isopen = !this.status.isopen
  }

}
