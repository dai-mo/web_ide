/**
 * Created by cmathew on 30.06.17.
 */

import { Component, Input } from "@angular/core"

@Component({
  selector: "abk-fields-to-map",
  templateUrl: "./fields-to-map.component.html",
  styleUrls: ["./fields-to-map.component.scss"]
})
export class FieldsToMapComponent {
  @Input() processorField: any
}
