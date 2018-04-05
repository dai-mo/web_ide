/**
 * Created by cmathew on 03.05.17.
 */
import { Component } from "@angular/core";
import { UiId } from "./shared/ui.models";
import { UIStateStore } from "./shared/ui.state.store";

@Component({
  selector: "app",
  templateUrl: "partials/layout.html"
})
export class LayoutComponent {
  uiId = UiId;

  constructor(private uiStateStore: UIStateStore) {}
}
