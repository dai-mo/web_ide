/**
 * Created by cmathew on 13/07/16.
 */
import { Component, Input, OnInit } from "@angular/core"
import { MenuItem, OverlayPanel } from "primeng/primeng"
import { Observable } from "rxjs/Observable"
import { UiId } from "./../../state/ui.models"
import { FlowTab } from "../../analyse/model/flow.model"
import { AppState, ObservableState } from "../../state/state"
import { ContextStore } from "../../state/context.store"
import { UIStateStore } from "../../state/ui.state.store"

@Component({
  selector: "abk-ws-view",
  templateUrl: "./ws-view.component.html",
  styleUrls: ["./ws-view.component.scss"]
})
export class WsViewComponent {
  @Input() name: String

  uiId = UiId

  flowTabs: Observable<FlowTab[]> = this.oss
    .appStore()
    .select((state: AppState) => state.flowTabs)

  constructor(
    public contextStore: ContextStore,
    public uiStateStore: UIStateStore,
    public oss: ObservableState
  ) {}

  maximiseView(event: any, viewName: string) {
    this.uiStateStore.maximiseView(viewName)
    this.uiStateStore.setResizeView(event)
  }
}
