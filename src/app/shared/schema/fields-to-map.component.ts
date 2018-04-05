/**
 * Created by cmathew on 30.06.17.
 */

import {Component, Input} from "@angular/core"

@Component({
  selector: "fields-to-map",
  template: `
  <i class="text-info">{{processorField.name}}</i>
  `
})
export class FieldsToMapComponent {

 @Input() processorField: any

}