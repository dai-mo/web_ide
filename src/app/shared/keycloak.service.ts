import {Injectable} from "@angular/core"
import {Observable, Observer} from "rxjs/Rx"
import * as Rx from "rxjs/Rx"
import {Http} from "@angular/http"
import {ErrorService} from "./util/error.service"


declare let Keycloak: any
declare let KeycloakAuthorization: any

@Injectable()
export class KeycloakService {
  static authConfig: any = {}
  static authz: any = {}
  static apiRpt: any = {}
  static rpt: string = ""
  static loggedIn: boolean = false
  static logoutUrl: string

  static ApiResourceId: string = "alambeek-api"


  static init(): Observable<any> {

    KeycloakService.authConfig = new Keycloak("/assets/keycloak.json")
    KeycloakService.loggedIn = false

    let kcInitObs = Rx.Observable.create(function (observer: Observer<any>) {
      KeycloakService.authConfig.init({ onLoad: "login-required" })
        .success(() => {
          KeycloakService.loggedIn = true

          KeycloakService.authz = new KeycloakAuthorization(KeycloakService.authConfig)
          KeycloakService.logoutUrl = KeycloakService.authConfig.authServerUrl + "/realms/demo/protocol/openid-connect/logout?redirect_uri=/index.html"
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

  static withTokenUpdate(apiCall: (rpt: string) => void): void {
    console.log("Access Token: " +  KeycloakService.authConfig.token)

    KeycloakService.authConfig.updateToken(5)
      .success(() => apiCall(KeycloakService.authConfig.token))
      .error(() => {
        console.log("Failed to refresh token")
      })
  }
}