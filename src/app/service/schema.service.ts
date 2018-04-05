/**
 * Created by cmathew on 23.05.17.
 */

import {Injectable} from "@angular/core"
import {Processor, RemoteProcessor} from "../analyse/flow.model"
import {ApiHttpService} from "../shared/api-http.service"
import {Http} from "@angular/http"
import {Observable} from "rxjs/Rx"


export class AvroSchemaField {
  name: string
  type: string | string[] | AvroSchemaType
  doc: string = ""
  defaultValue: string | boolean | number = null
  links: any[] = []

  static equals(fa:AvroSchemaField, fb: AvroSchemaField): boolean {
    if(!fa && !fb) return true
    if(!fa || !fb) return false
    if(fa.name !== fb.name) return false
    let fat: string | string[] | AvroSchemaType = fa.type
    let fbt: string | string[] | AvroSchemaType = fb.type

    // FIXME : How do we elegantly check for type ?
    if(typeof fat === "string" && typeof fbt === "string") {
      if(fat === fbt) return true
    }

    if(fat instanceof Array && fbt instanceof Array){
      if(fat[1] === fbt[1]) return true
    }

    if((<AvroSchemaType>fat).name && (<AvroSchemaType>fbt).name){
      if((<AvroSchemaType>fat).name === (<AvroSchemaType>fbt).name &&
        (<AvroSchemaType>fat).type === (<AvroSchemaType>fbt).type)
        return true
    }

    return false
  }

  static typeAsString(asf:AvroSchemaField): string {
    if(asf.type instanceof Array)
      return asf.type[1]
    if(typeof asf.type === "string")
      return asf.type
    if((<AvroSchemaType>asf.type).name)
      return (<AvroSchemaType>asf.type).name
    return undefined
  }
}

export class AvroSchemaType {
  type: string
  name: string
  fields: AvroSchemaField[]
}

export class AvroSchema extends AvroSchemaType {
  namespace: string
}

export class SchemaAction {
  action: string
  avroPath: string
  field: AvroSchemaField

  constructor(action: string,
              avroPath: string,
              field: AvroSchemaField) {
    this.action = action
    this.avroPath = avroPath
    this.field = field
  }
}


@Injectable()
export class SchemaService extends ApiHttpService {

  private processorSchemaUrl = "api/flow/processor/schema/"

  private schemaCache: Map<string, AvroSchema> = new Map()

  constructor(private fsHttp: Http) {
    super()
  }

  schema(schemaId: string): Observable<AvroSchema> {
    return super.get(this.processorSchemaUrl + schemaId)
  }

  updateSchema(flowInstanceId: string, processorId: string, schemaActions: SchemaAction[]): Observable<Processor[]> {
    return super.put(this.processorSchemaUrl + flowInstanceId + "/" + processorId, schemaActions)
  }

  static isSameNamespaceId(schema: AvroSchema, schemaToCompare: AvroSchema): boolean {
    if(schema && schemaToCompare &&
      schema.namespace === schemaToCompare.namespace && schema.name === schemaToCompare.name)
      return true
    else
      return false
  }

  baseSchema(processorProperties: any, forOutputSchema: boolean): Observable<AvroSchema> {
    if(forOutputSchema && this.isPropertyDefined(processorProperties._WRITE_SCHEMA_ID))
      return this.schemaFromId(processorProperties._WRITE_SCHEMA_ID)
    else
      return this.readSchema(processorProperties)
  }

  outputSchema(processorProperties: any): Observable<AvroSchema> {

    let writeSchema: Observable<AvroSchema> = this.writeSchema(processorProperties)

    if(writeSchema !== undefined) return writeSchema

    return this.readSchema(processorProperties)
  }

  readSchema(processorProperties: any): Observable<AvroSchema> {

    if(this.isPropertyDefined(processorProperties._READ_SCHEMA))
      return Observable.of(JSON.parse(processorProperties._READ_SCHEMA))

    if(this.isPropertyDefined(processorProperties._READ_SCHEMA_ID))
      return this.schemaFromId(processorProperties._READ_SCHEMA_ID)

    return undefined
  }

  writeSchema(processorProperties: any): Observable<AvroSchema> {
    if(this.isPropertyDefined(processorProperties._WRITE_SCHEMA))
      return Observable.of(JSON.parse(processorProperties._WRITE_SCHEMA))

    if(this.isPropertyDefined(processorProperties._WRITE_SCHEMA_ID))
      return this.schemaFromId(processorProperties._WRITE_SCHEMA_ID)

    return undefined
  }

  schemaFromId(schemaId: string): Observable<AvroSchema> {
    if(schemaId) {
      let cachedSchema = this.schemaCache.get(schemaId)
      if (cachedSchema)
        return Observable.of(cachedSchema)
      else
        return this.schema(schemaId).map(rs => {
          this.schemaCache.set(schemaId, rs)
          return rs
        })
    }
    return undefined
  }

  isPropertyDefined(property: string): boolean {
    return property !== undefined && property !== "" &&  property !== null
  }

}