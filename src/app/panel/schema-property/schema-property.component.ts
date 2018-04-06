import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { UIStateStore } from "./ui.state.store";
import { SchemaProperties } from "../analyse/flow.model";
import { ErrorService } from "./util/error.service";
import { FlowService } from "../service/flow.service";
import { Field } from "./ui.models";
import { SelectItem } from "primeng/primeng";
import { SchemaPanelComponent } from "./schema-panel.component";
import { DnDStore } from "./dnd.store";
import { ObservableState } from "../store/state";

/**
 * Created by cmathew on 19.05.17.
 */
@Component({
  selector: "schema-property",
  templateUrl: "./schema-property.component.html",
  styleUrls: ["./schema-property.component.scss"]
})
export class SchemaPropertyComponent implements OnInit {
  @ViewChild(SchemaPanelComponent) schemaPanelComponent: SchemaPanelComponent;

  @Input() schemaField: Field;
  parameters: SelectItem[];
  selectedParameter: string;
  fieldName: string;

  description: string = "description";
  dynamic: boolean = false;

  constructor(
    private uiStateStore: UIStateStore,
    private oss: ObservableState,
    private dndStore: DnDStore
  ) {
    this.parameters = [];
  }

  ngOnInit() {
    this.schemaField.setCollector(this.schemaPanelComponent.collect);
    this.fieldName = this.schemaField.name;
    this.parameters = [];
    let sfs: [
      {
        name: string;
        fieldType: string;
      }
    ] = JSON.parse(this.schemaField.defaultValue);
    sfs.forEach(sf => this.parameters.push({ label: sf.name, value: sf }));
  }

  dragStart(event: any, parameter: any) {
    this.dndStore.pSchemaParameter = parameter;
  }

  dragEnd(event: any) {}
}
