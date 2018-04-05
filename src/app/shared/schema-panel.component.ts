import {Component, Input, OnInit} from "@angular/core"
import {Processor, SchemaProperties} from "../analyse/flow.model"

import {TreeNode} from "primeng/primeng"
import {Observable} from "rxjs/Rx"
import {ErrorService} from "./util/error.service"
import {UIStateStore} from "./ui.state.store"
import {DnDStore} from "./dnd.store"
import {AvroSchema, AvroSchemaField, AvroSchemaType, SchemaAction, SchemaService} from "../service/schema.service"
import {AppState, ObservableState} from "../store/state"
import {Store} from "@ngrx/store"
import {UPDATE_CURRENT_PROCESSOR_PROPERTIES} from "../store/reducers"
import * as _ from "lodash"

/**
 * Created by cmathew on 23.05.17.
 */

@Component({
  selector: "schema-panel",
  templateUrl: "partials/schemapanel.html"
})
export class SchemaPanelComponent  implements OnInit {

  @Input() processor: Processor
  @Input() selectionMode: string
  @Input() mappedFieldName: string

  baseSchema: Observable<AvroSchema>

  schemaNamespace: string
  schemaName: string

  nodes: TreeNode[]
  rootNode: TreeNode

  selectedNodes: TreeNode[] = []
  initialNodes: TreeNode[] = []

  processorSchemaFields: any[] = []

  scp = SchemaProperties

  constructor(private schemaService: SchemaService,
              private uiStateStore: UIStateStore,
              private oss: ObservableState,
              private store: Store<AppState>,
              private dndStore: DnDStore,
              private errorService:ErrorService) {}

  ngOnInit(): void {
    this.nodes = []
    this.selectedNodes = []
    this.uiStateStore.setProcessorPropertiesToUpdate(this.processor.properties)
    this.processorSchemaFields = Object.keys(this.processor.properties)
      .filter(k => k === this.mappedFieldName)
      .map(k => JSON.parse(this.processor.properties[k]))

    this.baseSchema = this.schemaService.baseSchema(this.processor.properties, this.mappedFieldName === undefined)
    if (this.baseSchema !== undefined) {
      let outputSchema = this.schemaService.outputSchema(this.processor.properties)
      this.rootNode = {label: "$"}
      this.rootNode.expanded = true
      this.addSelectedNode(this.rootNode)

      this.baseSchema.flatMap(bs => outputSchema.map(ws => [bs, ws])).subscribe(
        (bws: [AvroSchema, AvroSchema]) => {
          this.schemaNamespace = bws[0].namespace
          this.schemaName = bws[0].name
          this.buildTree(bws[0], bws[1], this.rootNode)
        },
        (error: any) => {
          this.errorService.handleError(error)
        }
      )
      this.nodes.push(this.rootNode)
    }
  }

  addSelectedNode(node: TreeNode) {
    this.selectedNodes.push(node)
    this.initialNodes.push(node)
  }

  buildTree(baseSchemaType: AvroSchemaType, writeSchemaType: AvroSchemaType, parentTreeNode: TreeNode) {

    let children: TreeNode[] = baseSchemaType.fields.map((f: AvroSchemaField) => {
      let child: TreeNode
      let writeField: any
      if(writeSchemaType !== undefined) {
        writeField = writeSchemaType.fields.find(
          (wf: AvroSchemaField) => _.isEqual(wf, f))
      }
      if(f.type instanceof Array || typeof f.type === "string" ||
        (f.type.type !== undefined && (f.type.type === "map"))) {
        child = {label: f.name, leaf: true}
        if(writeField !== undefined)
          this.addSelectedNode(child)
      } else {
        child = {label: f.name}
        if(writeField !== undefined) {
          this.addSelectedNode(child)
          this.buildTree(f.type, writeField.type, child)
        }
        else
          this.buildTree(f.type, undefined, child)
        child.expanded = true
      }

      child.data = f

      let childSchemaPath = this.schemaFieldPath(child)
      this.processorSchemaFields.forEach(psf => {
        psf.forEach((sf: any) => {
            if (sf.jsonPath !== undefined &&
              "$." + childSchemaPath === sf.jsonPath) {
              this.addChildField(child, sf)
            }
          }
        )
      })
      return child
    })
    parentTreeNode.children = children
  }

  addChildField(node: TreeNode, sf: any) {
    if(node !== undefined && sf !== undefined) {
      if(node.children === undefined)
        node.children = []
      node.children.push({label: sf.name, type: this.mappedFieldName, leaf: true, data: sf})
      node.expanded = true
    }
  }

  removeLink(node: TreeNode) {
    node.parent.children = node.parent.children.filter(n => n !== node)
    this.updateSchemaFields()
  }

  updateNode(event: any) {
    this.uiStateStore.setSchemaUpdatable(this.canUpdate())
  }

  nodeType(node: TreeNode): string {
    if (node.data !== undefined) {
      let type = node.data.type
      if (_.isArray(type))
        return type[1]
      else if (_.isObject(type)) {
        if (type.name !== undefined)
          return type.name
        if (type.type !== undefined)
          return type.type
        return ""
      } else
        return type
    } else
      return ""
  }

    // FIXME: Should use schema paths to test equality

    nodesToRemove(): TreeNode[] {
      return this.initialNodes.
      filter(n => this.selectedNodes.find(sn => sn === n) === undefined).
      filter(n => n.partialSelected === undefined || !n.partialSelected)
    }

    nodesToAdd(): TreeNode[] {
      let nodes = this.selectedNodes.
      filter(sn => this.initialNodes.find(n => sn === n) === undefined).
      filter(sn => sn.partialSelected === undefined || !sn.partialSelected)

      return nodes
    }

    schemaFieldPath(node: TreeNode): string {
      if(node.parent === undefined)
        return node.label
      else
        return this.schemaFieldPath(node.parent) + "." + node.data.name
    }

    schemaActionFromTreeNodeToUpdate(node: TreeNode, action: string, path: string): SchemaAction {
      return new SchemaAction(action, path, JSON.parse(JSON.stringify(node.data)))
    }

    schemaActions(): SchemaAction[] {
      return this.cleanSchemaActions(
        this.nodesToRemove()
          .map(n => this.schemaActionFromTreeNodeToUpdate(n, "rem", this.schemaFieldPath(n)))
          .concat(this.nodesToAdd()
            .map(n => this.schemaActionFromTreeNodeToUpdate(n, "add", this.schemaFieldPath(n.parent)))))
    }

    cleanSchemaActions(schemaActions: SchemaAction[]): SchemaAction[] {
      let actions: SchemaAction[] = []
      schemaActions.
      forEach(sa => {
        if(schemaActions
            .find(a => sa.avroPath !== a.avroPath && sa.avroPath.startsWith(a.avroPath)) === undefined) {
          actions.push(sa)
        }
      })
      return actions
    }

    updateSchema(): Observable<Processor[]> {
      return this.schemaService.updateSchema(this.oss.activeFlowTab().flowInstance.id,
        this.processor.id,
        this.schemaActions())
    }

    canUpdate(): boolean { return this.initialNodes.length !== this.selectedNodes.length }

    currentSchemaFields(node: TreeNode, sfs: any[]) {
      if(node.type === this.mappedFieldName)
        sfs.push(node.data)
      if(node.children !== undefined && node.children.length > 0)
        node.children.forEach(c => this.currentSchemaFields(c, sfs))
    }

    updateSchemaFields() {
      let schemaFields: any[] = []
      if (this.rootNode !== undefined) {

        this.currentSchemaFields(this.rootNode, schemaFields)

        let props: any = {}
        props[this.mappedFieldName] = JSON.stringify(schemaFields)

        this.store.dispatch({
          type: UPDATE_CURRENT_PROCESSOR_PROPERTIES,
          payload: {properties: props}
        })
      }
    }

    collect = function():any {
      let schemaFields: any[] = []
      let props: any = {}
      if (this.rootNode !== undefined) {
        this.currentSchemaFields(this.rootNode, schemaFields)
        props[this.mappedFieldName] = JSON.stringify(schemaFields)
      }
      return props

    }.bind(this)

    nodeDrop(event: any, node: TreeNode) {
      let param = this.dndStore.pSchemaParameter
      param.jsonPath = this.schemaFieldPath(node)
      this.addChildField(node, param)
      this.updateSchemaFields()
    }
  }

