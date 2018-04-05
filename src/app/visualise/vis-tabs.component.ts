/**
 * Created by cmathew on 22.11.16.
 */

import {Component, Input} from "@angular/core"
import {UIStateStore} from "../shared/ui.state.store"
import {UiId} from "../shared/ui.models"
import {VisTab} from "../analyse/flow.model"


@Component({
  selector: "vis-tabs",
  templateUrl: "partials/visualise/vistabs.html",
})
export class VisTabsComponent {

  uiId = UiId

  @Input() selectedVisType: string

  constructor(private uiStateStore: UIStateStore) {

  }

  public selectActiveTab(index: number): void {
    let at = this.uiStateStore.getVisTabs()[index]
    if(at) this.uiStateStore.setActiveVisTab(at)
  }

  public getMapVisTab(): VisTab {
    return this.uiStateStore.getVisTabs().find(vt => vt.visType === UiId.VIS_MAP)
  }

}



