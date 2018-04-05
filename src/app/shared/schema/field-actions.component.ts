/**
 * Created by cmathew on 30.06.17.
 */

import {Component, Input} from "@angular/core"

@Component({
  selector: "field-actions",
  template: `
  <i class="text-info">{{processorField.name}}</i>
  <input type="text" pInputText [(ngModel)]="processorField.args"/>

  `
})
export class FieldActionsComponent {

  @Input() processorField: any

}