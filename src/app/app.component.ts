/**
 * Created by cmathew on 12/07/16.
 */
/**
 * Created by cmathew on 12/07/16.
 */

import { Component, Injector } from "@angular/core"

@Component({
  selector: "abk-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  constructor(private injector: Injector) {
    ServiceLocator.injector = injector
    // this.flowService.genClientId()
  }
}

export class ServiceLocator {
  static injector: Injector
}
