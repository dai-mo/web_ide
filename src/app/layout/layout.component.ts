/*
Copyright (c) 2017-2018 brewlabs SAS
*/
/**
 * Created by cmathew on 03.05.17.
 */
import { Component } from "@angular/core"
import { UiId } from "../state/ui.models"
import { UIStateStore } from "../state/ui.state.store"
import { ObservableState } from "../state/state"

@Component({
  selector: "abk-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.scss"]
})
export class LayoutComponent {
  uiId = UiId

  constructor(public uiStateStore: UIStateStore, public oss: ObservableState) {}
}
