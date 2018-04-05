import {Injectable} from "@angular/core"
import {Headers, Http, RequestOptions} from "@angular/http"
import "rxjs/add/operator/toPromise"
import "rxjs/add/operator/map"
import {Observable} from "rxjs/Rx"


import {
  FlowComponent,
  FlowEdge, FlowGraph, FlowInstance, FlowNode, FlowTemplate, Provenance,
  RemoteProcessor
} from "../analyse/flow.model"
import {ErrorService} from "../shared/util/error.service"
import {ApiHttpService} from "../shared/api-http.service"


@Injectable()
export class FlowService extends ApiHttpService {


  private templatesUrl = "api/flow/templates"
  private instantiateFlowBaseUrl: string = "api/flow/instances/instantiate/"
  private createInstanceBaseUrl: string = "api/flow/instances/create/"
  private instancesBaseUrl: string = "api/flow/instances/"
  private instancesStartUrl = this.instancesBaseUrl + "start/"
  private instancesStopUrl = this.instancesBaseUrl + "stop/"

  private listProvenanceBaseUrl: string = "api/flow/provenance/list/"

  constructor(private errorService: ErrorService) {
    super()
  }

  updateFlowHeaders(options: RequestOptions, rpt: string, version: string = ""): RequestOptions  {
    if(options.headers == null)
      options.headers = new Headers()
    if(rpt !== undefined)
      options.headers.append("Authorization", "Bearer " + rpt)
    if(this.flowClientId)
      options.headers.append("flow-client-id", this.flowClientId)
    if(version !== "")
      options.headers.append("flow-component-version", version)
    return options
  }


  templates(): Observable<Array<FlowTemplate>> {
    return this.http.get(this.templatesUrl).map(response => response.json())
  }

  instantiateTemplate(templateId: string, rpt: string): Observable<FlowInstance> {
    return this.http.post(this.instantiateFlowBaseUrl + templateId,
      {},
      this.updateFlowHeaders(new RequestOptions(), rpt)).map(response => response.json())
  }

  create(name: string, rpt: string): Observable<FlowInstance> {
    return super.post(this.createInstanceBaseUrl + name, {}, rpt)
  }

  instance(flowInstanceId: string): Observable<FlowInstance> {
    return this.http.get(this.instancesBaseUrl + flowInstanceId,
      this.updateFlowHeaders(new RequestOptions(), undefined)).map(response => response.json())
  }
  instances(rpt: string): Observable<Array<FlowInstance>> {
    return this.http.get(this.instancesBaseUrl,
      this.updateFlowHeaders(new RequestOptions(), rpt)).map(response => response.json())
  }

  startInstance(flowInstanceId: string): Observable<boolean> {
    return this.http.put(this.instancesStartUrl + flowInstanceId, {},
      this.updateFlowHeaders(new RequestOptions(), undefined)).map(response => response.json())
  }

  stopInstance(flowInstanceId: string): Observable<boolean> {
    return this.http.put(this.instancesStopUrl + flowInstanceId, {},
      this.updateFlowHeaders(new RequestOptions(), undefined)).map(response => response.json())
  }

  destroyInstance(flowInstanceId: string, hasExternal: boolean, rpt: string, version: string): Observable<boolean> {
    return this.http.delete(this.instancesBaseUrl + flowInstanceId + "/" + hasExternal,
      this.updateFlowHeaders(new RequestOptions(), rpt, version)).map(response => response.json())
  }

  provenance(processorId: string): Observable<Array<Provenance>> {
    return this.http.get(this.listProvenanceBaseUrl + processorId).map(response => response.json())
  }

  toFlowGraph(flowInstance: FlowInstance): FlowGraph {
    let links: FlowEdge[] = []
    let nodes: FlowNode[] = flowInstance.processors.map(p =>
      new FlowNode(p.id, p.type, p.processorType, p.validationErrors)
    )
    flowInstance.connections
      .filter(c => {
        return FlowComponent.isProcessor(c.config.destination.componentType) &&
        FlowComponent.isProcessor(c.config.source.componentType)
      })
      .forEach(c => {
      let sourceNodes: FlowNode[] = nodes.filter(p =>  p.uuid === c.config.source.id)
      let targetNodes: FlowNode[] = nodes.filter(p =>  p.uuid === c.config.destination.id)
      if(sourceNodes !== null &&
        sourceNodes.length === 1 &&
        targetNodes !== null &&
        targetNodes.length === 1)
        links.push(new FlowEdge(sourceNodes[0].id, targetNodes[0].id, c))
      else
        this.errorService.handleError("Flow Instance with id " + flowInstance.id + " is not valid")
    })


    return new FlowGraph(nodes, links)
  }


}