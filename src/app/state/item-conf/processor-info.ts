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
import { UIStateStore } from "./../ui.state.store"
import {
  ItemConf,
  Item,
  ItemStatus,
  FieldGroup,
  Field
} from "@blang/properties"
import {
  ProcessorDetails,
  MetaData,
  Configuration,
  RemoteRelationship
} from "../../model/flow.model"
import { ObservableState } from "../state"
import { ProcessorService } from "../../service/processor.service"
import { ErrorService } from "../../service/error.service"

export class ProcessorInfo extends ItemConf {
  static fromMetaData(metadata: MetaData): FieldGroup {
    const fields: Field[] = []

    fields.push(
      new Field("description", "description", "", "", [], metadata.description)
    )

    const tagsStr = metadata.tags.reduce(function(agg: string, value: string) {
      return agg === "" ? value : agg + " , " + value
    }, "")

    fields.push(new Field("tags", "tags", "", "", [], tagsStr))

    const relatedStr = metadata.related.reduce(function(
      agg: string,
      value: string
    ) {
      return agg === "" ? value : agg + " , " + value
    },
    "")

    fields.push(new Field("related", "related", "", "", [], relatedStr))
    return new FieldGroup("metadata", fields)
  }

  static fromConfiguration(configuration: Configuration): FieldGroup {
    const fields: Field[] = []

    fields.push(
      new Field(
        "processor class",
        "processor class",
        "",
        "",
        [],
        configuration.processorClassName
      )
    )
    fields.push(
      new Field(
        "stateful",
        "stateful",
        "",
        "",
        [],
        configuration.stateful.toString()
      )
    )
    fields.push(
      new Field(
        "trigger type",
        "trigger type",
        "",
        "",
        [],
        configuration.triggerType
      )
    )

    return new FieldGroup("configuration", fields)
  }

  static fromRelationships(relationships: RemoteRelationship[]): FieldGroup {
    const fields: Field[] = []

    relationships.forEach(r =>
      fields.push(new Field(r.id, r.id, r.description, "", [], r.description))
    )

    return new FieldGroup("relationships", fields)
  }
  constructor(
    processorServiceClassName: string,
    processorDetails: ProcessorDetails,
    private uiStateStore: UIStateStore
  ) {
    super(true)
    const fieldGroups: FieldGroup[] = [
      ProcessorInfo.fromMetaData(processorDetails.metadata),
      ProcessorInfo.fromConfiguration(processorDetails.configuration),
      ProcessorInfo.fromRelationships(processorDetails.relationships)
    ]
    this.items.push(
      new Item(
        processorServiceClassName,
        processorServiceClassName,
        "",
        ItemStatus.OK,
        fieldGroups
      )
    )
    this.hideCancel = true
  }

  postFinalise(data?: any): void {
    this.uiStateStore.isProcessorInfoDialogVisible = false
  }

  cancel(): void {
    this.uiStateStore.isProcessorInfoDialogVisible = false
  }
}
