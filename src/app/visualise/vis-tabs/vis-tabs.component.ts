/*
Copyright (c) 2017-2018 brewlabs SAS
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
