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
import { Injectable } from "@angular/core"
import { UIStateStore } from "../state/ui.state.store"
import { Msg, MsgGroup } from "../state/ui.models"

/**
 * Created by cmathew on 14/07/16.
 */

@Injectable()
export class ErrorService {
  constructor(private uiStateStore: UIStateStore) {}

  handleError(error: any) {
    const errorBody = JSON.parse(error._body)

    if ((<ErrorResponse>errorBody).code) {
      const msg: Msg = {
        severity: "error",
        summary: errorBody.message,
        detail: errorBody.description
      }

      const msgGroup: MsgGroup = {
        messages: [msg],
        sticky: false,
        delay: 3000
      }
      this.uiStateStore.setDisplayMessages(msgGroup)
    }
  }

  handleValidationErrors(errors: ValidationErrorResponse[]) {
    const msgs: Msg[] = errors.map((ver: ValidationErrorResponse) => {
      const msg: Msg = {
        severity: "error",
        summary: ver.message,
        detail: ver.description
      }
      return msg
    })

    const msgGroup: MsgGroup = {
      messages: msgs,
      sticky: false,
      delay: 3000
    }
    this.uiStateStore.setDisplayMessages(msgGroup)
  }
}

export class ErrorResponse {
  code: string
  message: string
  description: string
  httpStatusCode: number
}

export class ValidationErrorResponse {
  code: string
  message: string
  description: string
  validationInfo: Validation[]
}

export class Validation {
  code: string
  message: string
  processorName: string
  processorId: string
  processorPropertyName: string
  processorPropertyType: string
  processorSchemaFieldName: string
  processorSchemaFieldJsonPath: string
  processorSchemaFieldType: string
}
