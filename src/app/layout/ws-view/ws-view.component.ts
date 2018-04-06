/**
 * Created by cmathew on 13/07/16.
 */
import { Component, Input, OnInit } from "@angular/core";
import { MenuItem, OverlayPanel } from "primeng/primeng";
import { ContextStore } from "../context.store";
import { UIStateStore } from "../ui.state.store";
import { UiId } from "../ui.models";
import { AppState, ObservableState } from "../../store/state";
import { Observable } from "rxjs";
import { FlowTab } from "../../analyse/flow.model";

@Component({
  selector: "ws-view",
  templateUrl: "./ws-view.component.html",
  styleUrls: ["./ws-view.component.scss"]
})
export class WsViewComponent {
  @Input() name: String;

  uiId = UiId;

  flowTabs: Observable<FlowTab[]> = this.oss
    .appStore()
    .select((state: AppState) => state.flowTabs);

  constructor(
    private contextStore: ContextStore,
    private uiStateStore: UIStateStore,
    private oss: ObservableState
  ) {}

  maximiseView(event: any, viewName: string) {
    this.uiStateStore.maximiseView(viewName);
    this.uiStateStore.setResizeView(event);
  }
}
