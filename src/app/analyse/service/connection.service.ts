import { Injectable } from "@angular/core"

import { Observable } from "rxjs/Observable"
import { ApiHttpService } from "../../http/api-http.service"
import { ObservableState } from "../../state/state"
import {
  ConnectionConfig,
  Connection,
  FlowComponent
} from "../model/flow.model"

/**
 * Created by cmathew on 20.07.17.
 */

@Injectable()
export class ConnectionService extends ApiHttpService {
  private readonly connectionBaseUrl = "/api/flow/connection/"
  private readonly extConnectionBaseUrl = "/api/flow/connection/external/"

  constructor(private oss: ObservableState) {
    super()
  }

  create(connectionCreate: ConnectionConfig): Observable<Connection> {
    return super.post(this.connectionBaseUrl, connectionCreate)
  }

  remove(connection: Connection): Observable<boolean> {
    if (
      connection.config.source.componentType ===
        FlowComponent.ExternalProcessorType ||
      connection.config.destination.componentType ===
        FlowComponent.ExternalProcessorType
    ) {
      return this.deleteExternal(connection)
    } else {
      return this.deleteStd(connection.id)
    }
  }

  deleteStd(connectionId: string): Observable<boolean> {
    return super.delete(
      this.connectionBaseUrl + connectionId,
      this.oss.activeFlowTab().flowInstance.version
    )
  }

  deleteExternal(connection: Connection): Observable<boolean> {
    // FIXME : Deleting via 'PUT' is a workaround since
    //         'DELETE' does not allow a body. Passing the
    //         connection payload is required as this is a virtual connection
    //         i.e. one that is not stored on Nifi
    return super.put(
      this.extConnectionBaseUrl + connection.id,
      connection,
      connection.version
    )
  }
}
