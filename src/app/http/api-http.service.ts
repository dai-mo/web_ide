/*
Copyright (c) 2017-2018 brewlabs SAS
*/
import { UIStateStore } from "./../state/ui.state.store"
import {
  Headers,
  Http,
  RequestOptions,
  RequestOptionsArgs
} from "@angular/http"
import { Observable } from "rxjs/Observable"
import { ServiceLocator } from "../app.component"
import { ObservableState } from "../state/state"
import { environment } from "../../environments/environment"

/**
 * Created by cmathew on 21.06.17.
 */

export class ApiHttpService {
  // FIXME: Really bad hack to workaround client id
  //        initialisation in app.module.ts
  //        This should NOT be static
  public static flowClientId: string

  private apiBaseUrl = environment.apiBaseUrl
  protected http: Http
  protected clientIdUrl: string = this.apiBaseUrl + "/api/cid"

  constructor() {
    this.http = ServiceLocator.injector.get(Http)
  }

  updateHeaders(
    options: RequestOptions,
    rpt: string,
    version: string = ""
  ): RequestOptions {
    let ro = options
    if (ro === undefined) ro = new RequestOptions()

    if (ro.headers == null) ro.headers = new Headers()
    if (rpt !== undefined) ro.headers.append("Authorization", "Bearer " + rpt)
    if (ApiHttpService.flowClientId)
      ro.headers.append("flow-client-id", ApiHttpService.flowClientId)
    if (version !== "") ro.headers.append("flow-component-version", version)
    return ro
  }

  private apiUrl(url: string) {
    return this.apiBaseUrl + "/" + url
  }

  // genClientId(): void {
  //   const ciu = this.clientIdUrl
  //   this.http
  //     .get(this.clientIdUrl)
  //     .map(response => response.json())
  //     .map((cid: string) => {
  //       ApiHttpService.flowClientId = cid
  //     })
  //     .toPromise()
  // }

  get<T>(url: string, rpt?: string, options?: RequestOptions): Observable<T> {
    return this.http
      .get(this.apiUrl(url), this.updateHeaders(options, rpt))
      .map(response => response.json())
  }

  post<T>(
    url: string,
    body: any,
    rpt?: string,
    options?: RequestOptions
  ): Observable<T> {
    return this.http
      .post(this.apiUrl(url), body, this.updateHeaders(options, rpt))
      .map(response => response.json())
  }

  put<T>(
    url: string,
    body: any,
    version?: string,
    rpt?: string,
    options?: RequestOptions
  ): Observable<T> {
    return this.http
      .put(this.apiUrl(url), body, this.updateHeaders(options, rpt, version))
      .map(response => response.json())
  }

  delete(
    url: string,
    version: string,
    rpt?: string,
    options?: RequestOptions
  ): Observable<boolean> {
    return this.http
      .delete(this.apiUrl(url), this.updateHeaders(options, rpt, version))
      .map(response => response.json())
  }
}

export class Health {
  version: string
}
