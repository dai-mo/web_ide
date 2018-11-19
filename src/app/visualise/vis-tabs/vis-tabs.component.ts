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
/**
 * Created by cmathew on 22.11.16.
 */

import { Component, Input } from "@angular/core"
import { UiId } from "../../state/ui.models"
import { UIStateStore } from "../../state/ui.state.store"
import { VisTab } from "../../model/flow.model"

@Component({
  selector: "abk-vis-tabs",
  templateUrl: "./vis-tabs.component.html",
  styleUrls: ["./vis-tabs.component.scss"]
})
export class VisTabsComponent {
  uiId = UiId

  @Input() selectedVisType: string

  constructor(public uiStateStore: UIStateStore) {}

  public selectActiveTab(index: number): void {
    const at = this.uiStateStore.getVisTabs()[index]
    if (at) this.uiStateStore.setActiveVisTab(at)
  }

  public getMapVisTab(): VisTab {
    return this.uiStateStore
      .getVisTabs()
      .find(vt => vt.visType === UiId.VIS_MAP)
  }
}
