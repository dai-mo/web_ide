/*
Copyright (c) 2017-2018 brewlabs SAS
*/
import { MessageService } from "primeng/components/common/messageservice"
/**
 * Created by cmathew on 14/07/16.
 */
import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  AfterViewChecked,
  OnChanges
} from "@angular/core"
import { FlowService } from "./service/flow.service"
import { ErrorService } from "../service/error.service"

import { UIStateStore } from "../state/ui.state.store"
import { ContextMenuItem, UiId } from "../state/ui.models"
import { FlowEntityConf } from "../state/fields"

import { AppState, ObservableState } from "../state/state"
import { Observable } from "rxjs/Observable"
import {
  UPDATE_SELECTED_FLOW_ENTITY_CONF,
  ADD_CONTEXT_MENU_ITEMS
} from "../state/reducers"
import { TemplateInfo } from "../state/item-conf/template-info"
import { FlowCreation } from "../state/item-conf/flow-creation"
import { FlowTemplate } from "../model/flow.model"

@Component({
  selector: "abk-analyse",
  templateUrl: "./analyse.component.html",
  styleUrls: ["./analyse.component.scss"]
})
export class AnalyseComponent implements OnInit {
  public status: { isopen: boolean } = { isopen: false }
  public templates: Array<any>

  constructor(
    public oss: ObservableState,
    private flowService: FlowService,
    public uiStateStore: UIStateStore,
    private messageService: MessageService,
    private errorService: ErrorService
  ) {}

  getTemplates() {
    this.flowService.templates().subscribe(
      templates => {
        this.templates = templates
        const templateEntityInfo = new TemplateInfo(
          templates,
          this.uiStateStore
        )
        this.oss.dispatch({
          type: UPDATE_SELECTED_FLOW_ENTITY_CONF,
          payload: { flowEntityConf: templateEntityInfo }
        })
        this.uiStateStore.isTemplateInfoDialogVisible = true
      },
      (error: any) => {
        this.errorService.handleError(error)
      }
    )
  }

  ngOnInit() {}

  showTemplateInfoDialog() {
    this.getTemplates()
  }

  showFlowCreationDialog() {
    const flowCreation = new FlowCreation(
      this.oss,
      this.flowService,
      this.uiStateStore,
      this.messageService,
      this.errorService
    )
    this.oss.dispatch({
      type: UPDATE_SELECTED_FLOW_ENTITY_CONF,
      payload: { flowEntityConf: flowCreation }
    })
    this.uiStateStore.isFlowCreationDialogVisible = true
  }

  public toggleDropdown(event: MouseEvent): void {
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
