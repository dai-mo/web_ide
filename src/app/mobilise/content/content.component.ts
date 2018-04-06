/**
 * Created by cmathew on 15/08/16.
 */

import { FlowService } from "../service/flow.service";
import { ErrorService } from "../shared/util/error.service";
import { Component, Input, OnInit } from "@angular/core";
import { Action, EntityType, Provenance } from "../analyse/flow.model";
import { SelectItem } from "primeng/components/common/api";

import { UIStateStore } from "../shared/ui.state.store";
import { ContextBarItem, UiId } from "../shared/ui.models";
import { ContextStore } from "../shared/context.store";
import { ObservableState } from "../store/state";

@Component({
  selector: "content",
  templateUrl: "./content.component.html",
  styleUrls: ["./content.component.scss"]
})
export class ContentComponent implements OnInit {
  private provenances: Array<Provenance> = null;

  private actions: Action[] = [];

  rowOptions: SelectItem[] = [];
  selectedRowOption: string;

  formatOptions: SelectItem[] = [];
  selectedFormatOption: string;

  private results: Array<any> = [];
  private columns: Set<string> = new Set<string>();

  private formats: Array<string> = ["raw", "csv"];

  constructor(
    private flowService: FlowService,
    private oss: ObservableState,
    private errorService: ErrorService,
    private uiStateStore: UIStateStore,
    private contextStore: ContextStore
  ) {}

  @Input()
  set showProvenance(processorId: string) {
    this.showResults(processorId);
  }

  showResults(processorId: string) {
    this.actions = [];
    if (processorId !== undefined)
      this.flowService.provenance(processorId).subscribe(
        provenances => {
          this.provenances = provenances;
          this.uiStateStore.setProvenances(provenances);
          this.toData(this.provenances);
        },
        (error: any) => {
          this.errorService.handleError(error);
          // this.dialog.show("Processor Output", "Output for this processor has expired or been deleted")
        }
      );
    else this.provenances = null;
  }

  ngOnInit() {
    let cbItems: ContextBarItem[] = [
      {
        view: UiId.MOBILISE,
        entityType: EntityType.PROCESSOR,
        iconClass: "fa-refresh",
        enabled: true,
        command: event => {
          if (this.oss.selectedProcessor() !== undefined)
            this.showResults(this.oss.selectedProcessor().id);
        }
      }
    ];
    this.contextStore.addContextBar(UiId.MOBILISE, cbItems);
  }

  provenanceInfo(provenance: Provenance) {
    return "<b>id:</b> " + provenance.id;
  }

  hasResults(): boolean {
    return this.provenances != null && this.provenances.length > 0;
  }

  hasActions(): boolean {
    return this.actions.length > 0;
  }

  toData(provs: Array<Provenance>) {
    this.results = [];
    this.columns = new Set<string>();
    if (provs != null && provs.length > 0) {
      this.results = provs.map(p => {
        let content = JSON.parse(p.content);
        let record: any = { id: "" };
        for (let key in content) {
          this.columns.add(key);
          if (content[key]) record[key] = JSON.stringify(content[key]);
        }
        record.id = p.id;
        return record;
      });
    }
  }
}
