/*
Copyright (c) 2017-2018 brewlabs SAS
*/
import { UIStateStore } from "./state/ui.state.store"
/**
 * Created by cmathew on 12/07/16.
 */
/**
 * Created by cmathew on 12/07/16.
 */

import { Component, Injector } from "@angular/core"
import { ObservableState } from "./state/state"

@Component({
  selector: "abk-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  constructor(private injector: Injector, public uss: UIStateStore) {
    ServiceLocator.injector = injector
    // this.flowService.genClientId()
  }
}

export class ServiceLocator {
  static injector: Injector
}
