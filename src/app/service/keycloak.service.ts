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
import { Injectable } from "@angular/core"
import { Http } from "@angular/http"
import { Observable } from "rxjs/Observable"
import { Observer } from "rxjs/Observer"

declare let Keycloak: any
declare let KeycloakAuthorization: any

@Injectable()
export class KeycloakService {
  static authConfig: any = {}
  static authz: any = {}
  static apiRpt: any = {}
  static rpt = ""
  static loggedIn = false
  static logoutUrl: string

  static ApiResourceId = "alambeek-api"

  static withTokenUpdate(apiCall: (rpt: string) => void): void {
    console.log("Access Token: " + KeycloakService.authConfig.token)

    KeycloakService.authConfig
      .updateToken(5)
      .success(() => apiCall(KeycloakService.authConfig.token))
      .error(() => {
        console.log("Failed to refresh token")
      })
  }

  static init(): Observable<any> {
    KeycloakService.authConfig = new Keycloak("/assets/keycloak.json")
    KeycloakService.loggedIn = false

    const kcInitObs = Observable.create(function(observer: Observer<any>) {
      KeycloakService.authConfig
        .init({ onLoad: "login-required" })
        .success(() => {
          KeycloakService.loggedIn = true

          KeycloakService.authz = new KeycloakAuthorization(
            KeycloakService.authConfig
          )
          KeycloakService.logoutUrl =
            KeycloakService.authConfig.authServerUrl +
            "/realms/demo/protocol/openid-connect/logout?redirect_uri=/index.html"
          observer.next(KeycloakService.authConfig)
          observer.complete()
        })
        .error(() => {
          observer.error("Error initialising keycloak")
        })
    })
    return kcInitObs
  }

  logout() {
    console.log("*** LOGOUT ***")
    KeycloakService.loggedIn = false
    KeycloakService.authConfig = null

    window.location.href = KeycloakService.authConfig.logoutUrl
  }
}
