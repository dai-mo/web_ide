/**
 * Created by cmathew on 12/07/16.
 */
/**
 * Created by cmathew on 12/07/16.
 */

import {Component, Injector} from "@angular/core"


@Component({
    selector    : "app",
    template: `
   <router-outlet></router-outlet>   
  `
})
export class App {
    constructor(private injector: Injector) {
        ServiceLocator.injector = injector
        // this.flowService.genClientId()
    }
}

export class ServiceLocator {
    static injector: Injector
}