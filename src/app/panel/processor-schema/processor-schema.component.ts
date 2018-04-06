import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { UIStateStore } from "./ui.state.store";
import { FlowInstance, Processor } from "../analyse/flow.model";
import { SchemaPanelComponent } from "./schema-panel.component";
import { ErrorService, ValidationErrorResponse } from "./util/error.service";
import { FlowService } from "../service/flow.service";
import { ObservableState } from "../store/state";
import { UPDATE_FLOW_INSTANCE } from "../store/reducers";

/**
 * Created by cmathew on 19.05.17.
 */
@Component({
  selector: "processor-schema",
  templateUrl: "./processor-schema.component.html",
  styleUrls: ["./processor-schema.component.scss"]
})
export class ProcessorSchemaComponent {
  @ViewChild(SchemaPanelComponent) schemaPanelComponent: SchemaPanelComponent;

  constructor(
    private uiStateStore: UIStateStore,
    private oss: ObservableState,
    private flowService: FlowService,
    private errorService: ErrorService
  ) {}

  selectedProcessor$ = this.oss.selectedProcessor$();

  save() {
    this.schemaPanelComponent.updateSchema().subscribe(
      (processors: Processor[]) => {
        let vers: ValidationErrorResponse[] = processors
          .map(p => p.validationErrors)
          .filter(
            ver =>
              ver !== undefined &&
              ver.validationInfo.find(vi => vi.code === "DCS310") !== undefined
          );
        if (vers.length > 0) {
          this.errorService.handleValidationErrors(vers);
        } else {
          this.flowService
            .instance(this.oss.activeFlowTab().flowInstance.id)
            .subscribe(
              (flowInstance: FlowInstance) => {
                this.oss.dispatch({
                  type: UPDATE_FLOW_INSTANCE,
                  payload: {
                    flowInstance: flowInstance
                  }
                });
                this.uiStateStore.isProcessorSchemaDialogVisible = false;
              },
              (error: any) => {
                this.errorService.handleError(error);
              }
            );
        }
      },
      (error: any) => {
        this.errorService.handleError(error);
      }
    );
  }

  cancel() {
    this.uiStateStore.isProcessorSchemaDialogVisible = false;
  }
}
