/**
 * Created by cmathew on 14/07/16.
 */
import {Component, OnInit} from "@angular/core"
import {ErrorService} from "../shared/util/error.service"
import {UIStateStore} from "../shared/ui.state.store"
import {FlowService} from "../service/flow.service"
import {VisTab} from "../analyse/flow.model"
import {ContextMenuItem, UiId} from "../shared/ui.models"
import {ContextStore} from "../shared/context.store"

@Component({
  selector: "visualise",
  templateUrl: "partials/visualise/view.html"
})
export class VisualiseComponent implements OnInit {
  constructor(private uiStateStore: UIStateStore,
              private contextStore: ContextStore,
              private errorService: ErrorService) {

  }

  ngOnInit(): void {
    let cmItems: ContextMenuItem[] = [
      {label: "Map", command: (event) => {
        if(this.checkSelectedVisType(UiId.VIS_MAP))
          this.selectVisType(UiId.VIS_MAP)
      }},
      {label: "Chart", command: (event) => {
        if(this.checkSelectedVisType(UiId.VIS_CHART))
          this.selectVisType(UiId.VIS_CHART)
      }}
    ]
    this.contextStore.addContextMenu(UiId.VISUALISE, cmItems)
  }

  private checkSelectedVisType(visType: string): boolean {
    if(this.uiStateStore.getSelectedProcessorId() == null) {
      console.log("No processor selected")
      return false
    }

    if(this.uiStateStore.getVisTabs().find(vt => vt.visType === visType)) {
      console.log("The type " + visType + "is already selected")
      return false
    }
    return true
  }

  public selectVisType(visType: string): void {
    if(visType) {
      let visTab: VisTab = new VisTab(visType)
      this.uiStateStore.addVisTab(visTab)
      this.uiStateStore.setActiveVisTab(visTab)
    }
  }
}