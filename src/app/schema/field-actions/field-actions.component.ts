/*
Copyright (c) 2017-2018 brewlabs SAS

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/**
 * Created by cmathew on 30.06.17.
 */

import { Component, Input } from "@angular/core"

@Component({
  selector: "abk-field-actions",
  templateUrl: "./field-actions.component.html",
  styleUrls: ["./field-actions.component.scss"]
})
export class FieldActionsComponent {
  @Input() processorField: any
}
