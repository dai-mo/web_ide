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
