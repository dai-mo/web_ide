import { Component, Input, OnInit } from "@angular/core"
import { FormControl, FormGroup, Validators } from "@angular/forms"
import { FieldGroup, Field, FieldUIType } from "../../state/fields"

/**
 * Created by cmathew on 08.05.17.
 */
@Component({
  selector: "abk-flow-entity-info",
  templateUrl: "./flow-entity-info.component.html",
  styleUrls: ["./flow-entity-info.component.scss"]
})
export class FlowEntityInfoComponent implements OnInit {
  @Input() entityFieldGroup: FieldGroup
  fields: Field[]
  private form: FormGroup
  private fieldUIType = FieldUIType

  collect = function(): any {
    return this.form.value
  }.bind(this)

  ngOnInit() {
    this.fields = this.entityFieldGroup.fields
    this.entityFieldGroup.setCollector(this.collect)
    this.form = this.toFormGroup(this.fields)

    // this.fields.push(new Field("label", "This is a verrrrrry verrrry verrrry verrrry verrrry loonnnnnng description"))
    // this.fields.push(new Field("check", false, FieldType.BOOLEAN))
    // this.fields.push(new Field("property", "value", FieldType.STRING,[], true))
    // this.fields.push(new Field("list", "", FieldType.STRING,["value1", "value2", "value3"]))
  }

  toFormGroup(fields: Field[]): FormGroup {
    const group: any = {}

    fields.forEach((field: Field) => {
      if (field.isEditable)
        group[field.name] = field.isRequired
          ? new FormControl(field.value, Validators.required)
          : new FormControl(field.value)
    })

    return new FormGroup(group)
  }
}
