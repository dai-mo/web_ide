/**
 * Created by cmathew on 30.06.17.
 */

import { Component, Input } from "@angular/core";

@Component({
  selector: "field-actions",
  templateUrl: "./field-actions.component.html",
  styleUrls: ["./field-actions.component.scss"]
})
export class FieldActionsComponent {
  @Input() processorField: any;
}
