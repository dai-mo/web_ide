/**
 * Created by cmathew on 14/07/16.
 */
import { Component, OnInit } from "@angular/core"
import { UIStateStore } from "../state/ui.state.store"
import { ContextStore } from "../state/context.store"
import { ErrorService } from "../service/error.service"
import { ContextMenuItem, UiId } from "../state/ui.models"
import { VisTab } from "../analyse/model/flow.model"

@Component({
  selector: "abk-visualise",
  templateUrl: "./visualise.component.html",
  styleUrls: ["./visualise.component.scss"]
})
export class VisualiseComponent implements OnInit {
  constructor(
    public uiStateStore: UIStateStore,
    private contextStore: ContextStore,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    const cmItems: ContextMenuItem[] = [
      {
        label: "Map",
        command: event => {
          if (this.checkSelectedVisType(UiId.VIS_MAP))
            this.selectVisType(UiId.VIS_MAP)
        }
      },
      {
        label: "Chart",
        command: event => {
          if (this.checkSelectedVisType(UiId.VIS_CHART))
            this.selectVisType(UiId.VIS_CHART)
        }
      }
    ]
    this.contextStore.addContextMenu(UiId.VISUALISE, cmItems)
  }

  private checkSelectedVisType(visType: string): boolean {
    if (this.uiStateStore.getSelectedProcessorId() == null) {
      console.log("No processor selected")
      return false
    }

    if (this.uiStateStore.getVisTabs().find(vt => vt.visType === visType)) {
      console.log("The type " + visType + "is already selected")
      return false
    }
    return true
  }

  public selectVisType(visType: string): void {
    if (visType) {
      const visTab: VisTab = new VisTab(visType)
      this.uiStateStore.addVisTab(visTab)
      this.uiStateStore.setActiveVisTab(visTab)
    }
  }
}
