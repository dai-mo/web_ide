import { Injectable } from "@angular/core"
import { Headers, Http, RequestOptions } from "@angular/http"
import "rxjs/add/operator/toPromise"
import "rxjs/add/operator/map"
import { Observable } from "rxjs/Observable"

import {
  FlowComponent,
  FlowEdge,
  FlowGraph,
  FlowInstance,
  FlowNode,
  FlowTemplate,
  Provenance,
  RemoteProcessor
} from "../model/flow.model"
import { ErrorService } from "../../service/error.service"
import { ApiHttpService } from "../../http/api-http.service"

@Injectable()
export class FlowService extends ApiHttpService {
  private templatesUrl = "api/flow/templates"
  private instantiateFlowBaseUrl = "api/flow/instances/instantiate/"
  private createInstanceBaseUrl = "api/flow/instances/create/"
  private instancesBaseUrl = "api/flow/instances/"
  private instancesStartUrl = this.instancesBaseUrl + "start/"
  private instancesStopUrl = this.instancesBaseUrl + "stop/"

  private listProvenanceBaseUrl = "api/flow/provenance/list/"

  constructor(private errorService: ErrorService) {
    super()
  }

  updateFlowHeaders(
    options: RequestOptions,
    rpt: string,
    version: string = ""
  ): RequestOptions {
    if (options.headers == null) options.headers = new Headers()
    if (rpt !== undefined)
      options.headers.append("Authorization", "Bearer " + rpt)
    if (ApiHttpService.flowClientId)
      options.headers.append("flow-client-id", ApiHttpService.flowClientId)
    if (version !== "")
      options.headers.append("flow-component-version", version)
    return options
  }

  templates(): Observable<Array<FlowTemplate>> {
    return this.get(this.templatesUrl)
  }

  instantiateTemplate(
    templateId: string,
    rpt: string
  ): Observable<FlowInstance> {
    return this.post(
      this.instantiateFlowBaseUrl + templateId,
      {},
      rpt,
      new RequestOptions()
    )
  }

  create(name: string, rpt: string): Observable<FlowInstance> {
    return this.post(this.createInstanceBaseUrl + name, {}, rpt)
  }

  instance(flowInstanceId: string): Observable<FlowInstance> {
    return this.get(
      this.instancesBaseUrl + flowInstanceId,
      undefined,
      new RequestOptions()
    )
  }
  instances(rpt: string): Observable<Array<FlowInstance>> {
    return this.get(this.instancesBaseUrl, rpt, new RequestOptions())
  }

  startInstance(flowInstanceId: string): Observable<boolean> {
    return this.put(this.instancesStartUrl + flowInstanceId, {})
  }

  stopInstance(flowInstanceId: string): Observable<boolean> {
    return this.put(
      this.instancesStopUrl + flowInstanceId,
      {},
      "",
      undefined,
      new RequestOptions()
    )
  }

  destroyInstance(
    flowInstanceId: string,
    hasExternal: boolean,
    rpt: string,
    version: string
  ): Observable<boolean> {
    return this.delete(
      this.instancesBaseUrl + flowInstanceId + "/" + hasExternal,
      version,
      rpt,
      new RequestOptions()
    )
  }

  provenance(processorId: string): Observable<Array<Provenance>> {
    return this.get(this.listProvenanceBaseUrl + processorId)
  }

  toFlowGraph(flowInstance: FlowInstance): FlowGraph {
    const links: FlowEdge[] = []
    const nodes: FlowNode[] = flowInstance.processors.map(
      p => new FlowNode(p.id, p.type, p.processorType, p.validationErrors)
    )
    flowInstance.connections
      .filter(c => {
        return (
          FlowComponent.isProcessor(c.config.destination.componentType) &&
          FlowComponent.isProcessor(c.config.source.componentType)
        )
      })
      .forEach(c => {
        const sourceNodes: FlowNode[] = nodes.filter(
          p => p.uuid === c.config.source.id
        )
        const targetNodes: FlowNode[] = nodes.filter(
          p => p.uuid === c.config.destination.id
        )
        if (
          sourceNodes !== null &&
          sourceNodes.length === 1 &&
          targetNodes !== null &&
          targetNodes.length === 1
        )
          links.push(new FlowEdge(sourceNodes[0].id, targetNodes[0].id, c))
        else
          this.errorService.handleError(
            "Flow Instance with id " + flowInstance.id + " is not valid"
          )
      })

    return new FlowGraph(nodes, links)
  }
}
