import { Component, Input, OnInit, ViewChild } from "@angular/core"
import { SchemaPanelComponent } from "../schema/schema-panel.component"
import { Field } from "../../state/fields"
import { SelectItem } from "primeng/primeng"
import { UIStateStore } from "../../state/ui.state.store"
import { ObservableState } from "../../state/state"
import { DnDStore } from "../../state/dnd.store"

/**
 * Created by cmathew on 19.05.17.
 */
@Component({
  selector: "abk-schema-property",
  templateUrl: "./schema-property.component.html",
  styleUrls: ["./schema-property.component.scss"]
})
export class SchemaPropertyComponent implements OnInit {
  @ViewChild(SchemaPanelComponent) schemaPanelComponent: SchemaPanelComponent

  @Input() schemaField: Field
  parameters: SelectItem[]
  selectedParameter: string
  fieldName: string

  description = "description"
  dynamic = false

  constructor(
    private uiStateStore: UIStateStore,
    private oss: ObservableState,
    private dndStore: DnDStore
  ) {
    this.parameters = []
  }

  ngOnInit() {
    this.schemaField.setCollector(this.schemaPanelComponent.collect)
    this.fieldName = this.schemaField.name
    this.parameters = []
    const sfs: [
      {
        name: string
        fieldType: string
      }
    ] = JSON.parse(this.schemaField.defaultValue)
    sfs.forEach(sf => this.parameters.push({ label: sf.name, value: sf }))
  }

  dragStart(event: any, parameter: any) {
    this.dndStore.pSchemaParameter = parameter
  }

  dragEnd(event: any) {}
}
