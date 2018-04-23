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

/**
 * Created by cmathew on 21.06.17.
 */

export class ApiHttpService {
  protected http: Http
  protected flowClientId: string
  protected clientIdUrl: string = UIStateStore.appConfig.baseUrl + "/api/cid"

  constructor() {
    this.http = ServiceLocator.injector.get(Http)
    this.genClientId()
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
    if (this.flowClientId)
      ro.headers.append("flow-client-id", this.flowClientId)
    if (version !== "") ro.headers.append("flow-component-version", version)
    return ro
  }

  private apiUrl(url: string) {
    return UIStateStore.appConfig.baseUrl + "/" + url
  }

  genClientId(): void {
    const ciu = this.clientIdUrl
    this.http
      .get(this.clientIdUrl)
      .map(response => response.json())
      .subscribe((cid: string) => (this.flowClientId = cid))
  }

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
