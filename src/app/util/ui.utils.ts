/*
Copyright (c) 2017-2018 brewlabs SAS
*/
import {
  CoreProperties,
  ExternalProcessorProperties,
  FlowInstance,
  FlowTab,
  Processor
} from "../model/flow.model"
import * as SI from "seamless-immutable"
import { isEmpty } from "rxjs/operator/isEmpty"

/**
 * Created by cmathew on 14/07/16.
 */

export class UIUtils {
  static toFlowTab(flowInstance: FlowInstance): FlowTab {
    return SI.from(
      new FlowTab("#", flowInstance.id, flowInstance.name, flowInstance)
    )
  }
}

export class JSUtils {
  static isEmpty(obj: any): boolean {
    for (const x in obj) return false
    return true
  }

  static isUndefinedOrEmpty(obj: any): boolean {
    return obj === undefined || JSUtils.isEmpty(obj)
  }
}

export class FlowUtils {
  static processorServiceClassName(processor: Processor): string {
    if (processor.properties !== undefined)
      return processor.properties[CoreProperties._PROCESSOR_CLASS]
    return undefined
  }

  static addExternalCoreProperties(processor: Processor, properties: any): any {
    const withCoreProperties = SI.from(properties)
    return withCoreProperties
      .set(
        CoreProperties._PROCESSOR_CLASS,
        processor.properties[CoreProperties._PROCESSOR_CLASS]
      )
      .set(
        CoreProperties._PROCESSOR_TYPE,
        processor.properties[CoreProperties._PROCESSOR_TYPE]
      )
      .set(
        CoreProperties._READ_SCHEMA_ID,
        processor.properties[CoreProperties._READ_SCHEMA_ID]
      )
      .set(
        CoreProperties._READ_SCHEMA,
        processor.properties[CoreProperties._READ_SCHEMA]
      )
      .set(
        CoreProperties._WRITE_SCHEMA_ID,
        processor.properties[CoreProperties._WRITE_SCHEMA_ID]
      )
      .set(
        CoreProperties._WRITE_SCHEMA,
        processor.properties[CoreProperties._WRITE_SCHEMA]
      )
    // .set(ExternalProcessorProperties.RootInputConnectionIdKey,
    //   processor.properties[ExternalProcessorProperties.RootInputConnectionIdKey])
    // .set(ExternalProcessorProperties.RootOutputConnectionIdKey,
    //   processor.properties[ExternalProcessorProperties.RootOutputConnectionIdKey])
    // .set(ExternalProcessorProperties.InputPortNameKey,
    //   processor.properties[ExternalProcessorProperties.InputPortNameKey])
    // .set(ExternalProcessorProperties.OutputPortNameKey,
    //   processor.properties[ExternalProcessorProperties.OutputPortNameKey])
  }
}
