import {Injectable} from "@angular/core"
import {UIStateStore} from "../ui.state.store"
import {Msg, MsgGroup} from "../ui.models"
/**
 * Created by cmathew on 14/07/16.
 */

@Injectable()
export class ErrorService {

    constructor(private uiStateStore: UIStateStore) {}

    handleError(error: any) {
        let errorBody = JSON.parse(error._body)

        if ((<ErrorResponse>errorBody).code) {

            let msg: Msg = {
                severity: "error",
                summary: errorBody.message,
                detail: errorBody.description
            }

            let msgGroup: MsgGroup = {
                messages: [msg],
                sticky: false,
                delay: 3000
            }
            this.uiStateStore
              .setDisplayMessages(msgGroup)
        }
    }

    handleValidationErrors(errors: ValidationErrorResponse[]) {

        let msgs: Msg[] = errors.map((ver: ValidationErrorResponse) => {
            let msg: Msg = {
                severity: "error",
                summary: ver.message,
                detail: ver.description
            }
            return msg})


        let msgGroup: MsgGroup = {
            messages: msgs,
            sticky: false,
            delay: 3000
        }
        this.uiStateStore
          .setDisplayMessages(msgGroup)
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