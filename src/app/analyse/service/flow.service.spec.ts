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
import {
  BaseRequestOptions,
  ConnectionBackend,
  Http,
  HttpModule,
  RequestOptions,
  Response,
  ResponseOptions,
  XHRBackend
} from "@angular/http"
import { async, fakeAsync, inject, TestBed } from "@angular/core/testing"
import { MockBackend, MockConnection } from "@angular/http/testing"
import { FlowService } from "./flow.service"

import { ReflectiveInjector } from "@angular/core"
import { ServiceLocator } from "../../app.component"
import { ErrorService } from "../../service/error.service"
import { UIStateStore } from "../../state/ui.state.store"
import { ContextStore } from "../../state/context.store"
import {
  FlowTemplate,
  FlowInstance,
  FlowNode,
  FlowGraph
} from "../model/flow.model"

describe("Flow Service", () => {
  ServiceLocator.injector = ReflectiveInjector.resolveAndCreate([
    { provide: ConnectionBackend, useClass: MockBackend },
    { provide: RequestOptions, useClass: BaseRequestOptions },
    Http
  ])

  // setup
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        // StoreModule.provideStore(rootReducer),
        HttpModule
      ],
      providers: [
        FlowService,
        ErrorService,
        UIStateStore,
        ContextStore,
        // ObservableState,
        { provide: XHRBackend, useClass: MockBackend }
      ]
    })
  })

  it(
    "should retrieve templates",
    inject(
      [XHRBackend, FlowService],
      fakeAsync((mockbackend: MockBackend, flowService: FlowService) => {
        let ts: Array<FlowTemplate>
        mockbackend.connections.subscribe((connection: MockConnection) => {
          const mockResponseBody: FlowTemplate[] = [
            {
              id: "7c88e3e4-0dce-498b-8ee0-098281abb32a",
              uri:
                "http://localhost:8888/nifi-api/controller/templates/7c88e3e4-0dce-498b-8ee0-098281abb32a",
              name: "CsvToJSON",
              description: "",
              date: "1464736682000"
            },
            {
              id: "d73b5a44-5968-47d5-9a9a-aea5664c5835",
              uri:
                "http://localhost:8888/nifi-api/controller/templates/d73b5a44-5968-47d5-9a9a-aea5664c5835",
              name: "DateConversion",
              description: "",
              date: "1464728751000"
            }
          ]

          const response = new ResponseOptions({
            body: JSON.stringify(mockResponseBody)
          })
          connection.mockRespond(new Response(response))
        })

        flowService.templates().subscribe(templates => {
          ts = templates
          expect(ts.length).toBe(2)
        })
      })
    )
  )

  it("it should retrieve a template", async(
    inject(
      [XHRBackend, FlowService],
      (mockbackend: MockBackend, flowService: FlowService) => {
        mockbackend.connections.subscribe((connection: MockConnection) => {
          const mockResponseBody: FlowInstance = {
            id: "",
            name: "DateConversion",
            nameId: "aff997c4-d43c-4a7e-93b6-1f1ae2bddf8a",
            state: "RUNNING",
            version: "3",
            processors: [
              {
                id: "31893b7f-2b44-48d6-b07f-174edde34745",
                type: "some.type",
                version: "1",
                status: "STOPPED",
                processorType: "type",
                properties: {},
                propertyDefinitions: [],
                relationships: [],
                validationErrors: undefined
              },
              {
                id: "623f3887-cc72-412e-82d8-e21ee0d7705f",
                type: "some.type",
                version: "1",
                status: "STOPPED",
                processorType: "type",
                properties: {},
                propertyDefinitions: [],
                relationships: [],
                validationErrors: undefined
              },
              {
                id: "555bde07-8282-4719-aec6-6a64ce227c60",
                type: "some.type",
                version: "1",
                status: "STOPPED",
                processorType: "type",
                properties: {},
                propertyDefinitions: [],
                relationships: [],
                validationErrors: undefined
              },
              {
                id: "9b9620fe-3c40-4263-82eb-f49853a6ef79",
                type: "some.type",
                version: "1",
                status: "STOPPED",
                processorType: "type",
                properties: {},
                propertyDefinitions: [],
                relationships: [],
                validationErrors: undefined
              },
              {
                id: "ee25be65-4479-4528-b5f7-dc24a75eaf22",
                type: "some.type",
                version: "1",
                status: "STOPPED",
                processorType: "type",
                properties: {},
                propertyDefinitions: [],
                relationships: [],
                validationErrors: undefined
              }
            ],
            connections: [
              {
                id: "102509b5-3ae2-41b3-b7a8-15b3203419c4",
                source: {
                  id: "623f3887-cc72-412e-82d8-e21ee0d7705f",
                  type: "ProcessorType"
                },
                destination: {
                  id: "9b9620fe-3c40-4263-82eb-f49853a6ef79",
                  type: "ProcessorType"
                }
              },
              {
                id: "19c466d3-9af5-4634-8d07-4860e1d26511",
                source: {
                  id: "31893b7f-2b44-48d6-b07f-174edde34745",
                  type: "ProcessorType"
                },
                destination: {
                  id: "ee25be65-4479-4528-b5f7-dc24a75eaf22",
                  type: "ProcessorType"
                }
              },
              {
                id: "21d17780-5127-4140-8096-82018fd717e4",
                source: {
                  id: "9b9620fe-3c40-4263-82eb-f49853a6ef79",
                  type: "ProcessorType"
                },
                destination: {
                  id: "31893b7f-2b44-48d6-b07f-174edde34745",
                  type: "ProcessorType"
                }
              },
              {
                id: "da36ece5-9c3d-40c5-95d0-672040db749c",
                source: {
                  id: "555bde07-8282-4719-aec6-6a64ce227c60",
                  type: "ProcessorType"
                },
                destination: {
                  id: "623f3887-cc72-412e-82d8-e21ee0d7705f",
                  type: "ProcessorType"
                }
              }
            ]
          }

          const response = new ResponseOptions({
            body: JSON.stringify(mockResponseBody)
          })
          connection.mockRespond(new Response(response))
        })

        flowService
          .instantiateTemplate("7c88e3e4-0dce-498b-8ee0-098281abb32a", "qwerty")
          .subscribe(instance => {
            expect(instance.processors.length).toBe(5)
            expect(instance.connections.length).toBe(4)

            const nodes: FlowNode[] = []
            nodes.push(
              new FlowNode(
                "555bde07-8282-4719-aec6-6a64ce227c60",
                "some.type",
                "ptype",
                [],
                "label"
              )
            )
            nodes.push(
              new FlowNode(
                "623f3887-cc72-412e-82d8-e21ee0d7705f",
                "some.type",
                "ptype",
                [],
                "label"
              )
            )
            nodes.push(
              new FlowNode(
                "9b9620fe-3c40-4263-82eb-f49853a6ef79",
                "some.type",
                "ptype",
                [],
                "label"
              )
            )
            nodes.push(
              new FlowNode(
                "31893b7f-2b44-48d6-b07f-174edde34745",
                "some.type",
                "ptype",
                [],
                "label"
              )
            )
            nodes.push(
              new FlowNode(
                "ee25be65-4479-4528-b5f7-dc24a75eaf22",
                "some.type",
                "ptype",
                [],
                "label"
              )
            )
            const expFlowGraph: FlowGraph = {
              nodes: nodes,
              edges: [
                {
                  from: "555bde07-8282-4719-aec6-6a64ce227c60",
                  to: "623f3887-cc72-412e-82d8-e21ee0d7705f",
                  arrows: "to"
                },
                {
                  from: "623f3887-cc72-412e-82d8-e21ee0d7705f",
                  to: "9b9620fe-3c40-4263-82eb-f49853a6ef79",
                  arrows: "to"
                },
                {
                  from: "9b9620fe-3c40-4263-82eb-f49853a6ef79",
                  to: "31893b7f-2b44-48d6-b07f-174edde34745",
                  arrows: "to"
                },
                {
                  from: "31893b7f-2b44-48d6-b07f-174edde34745",
                  to: "ee25be65-4479-4528-b5f7-dc24a75eaf22",
                  arrows: "to"
                }
              ]
            }
            const actFlowGraph = flowService.toFlowGraph(instance)

            expect(actFlowGraph.nodes.length).toBe(expFlowGraph.nodes.length)
            actFlowGraph.nodes.forEach((an: FlowNode) => {
              expect(
                expFlowGraph.nodes.filter(en => an.id === en.id).length
              ).toBe(1)
            })

            expect(actFlowGraph.edges.length).toBe(expFlowGraph.edges.length)
          })
      }
    )
  ))
})
