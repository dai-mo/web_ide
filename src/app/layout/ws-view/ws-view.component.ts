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
import { AnalyseComponent } from "./../../analyse/analyse.component"
/**
 * Created by cmathew on 13/07/16.
 */
import { Component, Input, OnInit, ViewChild } from "@angular/core"
import { MenuItem, OverlayPanel } from "primeng/primeng"
import { Observable } from "rxjs/Observable"
import { UiId, ContextMenuItem } from "./../../state/ui.models"
import { FlowTab } from "../../model/flow.model"
import { AppState, ObservableState } from "../../state/state"
import { UIStateStore } from "../../state/ui.state.store"
import { ADD_CONTEXT_MENU_ITEMS } from "../../state/reducers"

@Component({
  selector: "abk-ws-view",
  templateUrl: "./ws-view.component.html",
  styleUrls: ["./ws-view.component.scss"]
})
export class WsViewComponent implements OnInit {
  @ViewChild(AnalyseComponent) analyse: AnalyseComponent
  @Input() name: string

  uiId = UiId

  flowTabs: Observable<FlowTab[]> = this.oss
    .appStore()
    .select((state: AppState) => state.flowTabs)

  constructor(public uiStateStore: UIStateStore, public oss: ObservableState) {}

  ngOnInit(): void {
    switch (this.name) {
      case UiId.ANALYSE: {
        const cmItems: ContextMenuItem[] = [
          {
            label: "Instantiate Flow",
            command: event => {
              this.analyse.showTemplateInfoDialog()
            }
          },
          {
            label: "Create Flow",
            command: event => {
              this.analyse.showFlowCreationDialog()
            }
          }
        ]

        this.oss.dispatch({
          type: ADD_CONTEXT_MENU_ITEMS,
          payload: {
            key: UiId.ANALYSE,
            items: cmItems
          }
        })
        break
      }
    }
  }

  maximiseView(event: any, viewName: string) {
    this.uiStateStore.maximiseView(viewName)
    this.uiStateStore.setResizeView(event)
  }
}
