/**
 * Created by cmathew on 14/07/16.
 */
import { Component } from "@angular/core"
import { UIStateStore } from "../state/ui.state.store"
import { ObservableState } from "../state/state"

@Component({
  selector: "abk-mobilise",
  templateUrl: "./mobilise.component.html",
  styleUrls: ["./mobilise.component.scss"]
})
export class MobiliseComponent {
  constructor(
    private uiStateStore: UIStateStore,
    public oss: ObservableState
  ) {}
}
