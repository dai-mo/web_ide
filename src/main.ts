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
import { ModalMessage } from "./app/state/ui.models"
import { NEW_MODAL_MESSAGE } from "./app/state/reducers"
import { enableProdMode, ReflectiveInjector } from "@angular/core"
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic"

import { AppModule } from "./app/app.module"
import { environment } from "./environments/environment"
import { KeycloakService } from "./app/service/keycloak.service"
import { ApiHttpService, Health } from "./app/http/api-http.service"
import { ObservableState } from "./app/state/state"
import { Http } from "@angular/http"

if (environment.production) {
  enableProdMode()
}

// const injector = ReflectiveInjector.resolveAndCreate([Http, ObservableState])
// const http = injector.get(Http)
// const oss = injector.get(ObservableState)

// this.http
//   .get("api/health")
//   .map((response: any) => response.json())
//   .subscribe(
//     (health: Health) => {},
//     (error: any) => {
//       oss.dispatch({
//         type: NEW_MODAL_MESSAGE,
//         payload: new ModalMessage(
//           true,
//           "Server Not Avaliable",
//           "Could not connect to alambeek web api",
//           false
//         )
//       })
//     }
//   )
KeycloakService.init().subscribe(
  () => {
    platformBrowserDynamic()
      .bootstrapModule(AppModule)
      .catch(err => console.log(err))
  },
  (error: any) => console.log(error)
)
