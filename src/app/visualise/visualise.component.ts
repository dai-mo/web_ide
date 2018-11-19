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
