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
import { ApiHttpService } from "../http/api-http.service"
import { Observable } from "rxjs/Observable"
import {
  Processor,
  PropertyDefinition,
  ProcessorDetails,
  ProcessorServiceDefinition
} from "../model/flow.model"

/**
 * Created by cmathew on 05.07.17.
 */

@Injectable()
export class ProcessorService extends ApiHttpService {
  private readonly processorBaseUrl = "api/flow/processor/"

  processorUpdatePropertiesUrl(
    processorServiceClassName: string,
    processorId: string,
    flowInstanceId: string
  ): string {
    return (
      this.processorBaseUrl +
      processorServiceClassName +
      "/" +
      processorId +
      "/" +
      flowInstanceId +
      "/properties"
    )
  }

  processorPropertiesUrl(processorServiceClassName: string): string {
    return this.processorBaseUrl + processorServiceClassName + "/properties"
  }

  updateProperties(
    processorServiceClassName: string,
    processorId: string,
    properties: any,
    flowInstanceId: string
  ): Observable<Processor> {
    return super.put(
      this.processorUpdatePropertiesUrl(
        processorServiceClassName,
        processorId,
        flowInstanceId
      ),
      properties
    )
  }

  properties(
    processorServiceClassName: string
  ): Observable<PropertyDefinition[]> {
    return super.get(this.processorPropertiesUrl(processorServiceClassName))
  }

  details(
    processorServiceClassName: string,
    stateful?: boolean
  ): Observable<ProcessorDetails> {
    if (stateful !== undefined)
      return super.get(
        this.processorBaseUrl +
          "details/" +
          processorServiceClassName +
          "/" +
          stateful
      )
    else
      return super.get(
        this.processorBaseUrl + "details/" + processorServiceClassName
      )
  }

  list(): Observable<ProcessorServiceDefinition[]> {
    return super.get(this.processorBaseUrl)
  }

  create(
    flowInstanceId: string,
    psd: ProcessorServiceDefinition
  ): Observable<Processor> {
    return super.post(this.processorBaseUrl + "create/" + flowInstanceId, psd)
  }

  destroy(
    processorId: string,
    flowInstanceId: string,
    processorType: string,
    version: string
  ): Observable<boolean> {
    return super.delete(
      this.processorBaseUrl +
        processorId +
        "/" +
        flowInstanceId +
        "/" +
        processorType,
      version
    )
  }
}
