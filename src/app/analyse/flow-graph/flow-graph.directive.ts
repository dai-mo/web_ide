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
import { Directive, ElementRef, Input } from "@angular/core"

import { FlowService } from "../service/flow.service"

import { FlowGraphService } from "./flow-graph.service"
import { FlowInstance } from "../../model/flow.model";

@Directive({
  selector: "[flow-graph]"
})
export class FlowGraphDirective {
  private el: HTMLElement

  @Input()
  set showFlowInstance(flowInstance: FlowInstance) {
    if (flowInstance) {
      this.flowGraphService.addFlatGraph(
        this.el,
        this.flowService.toFlowGraph(flowInstance)
      )
    }
  }

  constructor(
    el: ElementRef,
    private flowGraphService: FlowGraphService,
    private flowService: FlowService
  ) {
    this.el = el.nativeElement
  }
}
