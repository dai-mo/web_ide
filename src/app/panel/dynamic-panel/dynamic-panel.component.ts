import { Component, OnInit } from "@angular/core"
import { FieldUIType, Field, DynamicComponent } from "@blang/properties"
import { ProcessorFieldUIType } from "../../state/fields"

@Component({
  selector: "abk-dynamic",
  templateUrl: "./dynamic-panel.component.html",
  styleUrls: ["./dynamic-panel.component.scss"]
})
export class DynamicPanelComponent implements OnInit, DynamicComponent {
  data: Field
  fieldUIType = ProcessorFieldUIType

  constructor() {}

  ngOnInit() {}
}
