/*
Copyright (c) 2017-2018 brewlabs SAS
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
