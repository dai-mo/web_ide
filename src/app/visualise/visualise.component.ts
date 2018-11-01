/*
Copyright (c) 2017-2018 brewlabs SAS
*/
import { ObservableState } from "./../state/state"
/**
 * Created by cmathew on 14/07/16.
 */
import { Component, OnInit } from "@angular/core"
import { UIStateStore } from "../state/ui.state.store"
import { ErrorService } from "../service/error.service"
import { ContextMenuItem, UiId } from "../state/ui.models"
import { VisTab } from "../model/flow.model"
import { ADD_CONTEXT_MENU_ITEMS } from "../state/reducers"

@Component({
  selector: "abk-visualise",
  templateUrl: "./visualise.component.html",
  styleUrls: ["./visualise.component.scss"]
})
export class VisualiseComponent implements OnInit {
  constructor(
    public uiStateStore: UIStateStore,
    private oss: ObservableState,
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

    // this.oss.dispatch({
    //   type: ADD_CONTEXT_MENU_ITEMS,
    //   payload: {
    //     key: UiId.VISUALISE,
    //     items: cmItems
    //   }
    // })
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
