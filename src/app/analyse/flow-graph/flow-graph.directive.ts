import {Directive, ElementRef, Input} from "@angular/core"
import {FlowInstance} from "./flow.model"
import {FlowGraphService} from "./shared/flow-graph.service"
import {FlowService} from "../service/flow.service"



@Directive({
  selector: "[flow-graph]"
})

export class FlowGraphDirective {

  private el:HTMLElement

  @Input()
  set showFlowInstance(flowInstance: FlowInstance) {
    if (flowInstance) {
      this.flowGraphService.addFlatGraph(this.el, this.flowService.toFlowGraph(flowInstance))
    }
  }

  constructor(el:ElementRef,
              private flowGraphService: FlowGraphService,
              private flowService: FlowService) {
    this.el = el.nativeElement
  }
}
