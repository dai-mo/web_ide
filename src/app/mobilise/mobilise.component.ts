/**
 * Created by cmathew on 14/07/16.
 */
import { Component } from "@angular/core";
import { ContentComponent } from "./content.component";
import { UIStateStore } from "../shared/ui.state.store";
import { ObservableState } from "../store/state";

@Component({
  selector: "mobilise",
  templateUrl: "./mobilise.component.html",
  styleUrls: ["./mobilise.component.scss"]
})
export class MobiliseComponent {
  constructor(
    private uiStateStore: UIStateStore,
    private oss: ObservableState
  ) {}
}
