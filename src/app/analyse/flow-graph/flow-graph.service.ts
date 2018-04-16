/**
 * Created by cmathew on 29/07/16.
 */

import { Injectable, NgZone } from "@angular/core"

import { FlowGraph } from "../model/flow.model"
import { UIStateStore } from "../../state/ui.state.store"
import { ObservableState } from "../../state/state"
import { SELECT_ENTITY } from "../../state/reducers";

declare var vis: any

@Injectable()
export class FlowGraphService {
  constructor(
    private uiStateStore: UIStateStore,
    private oss: ObservableState,
    private ngZone: NgZone
  ) {}

  addFlatGraph(el: HTMLElement, graph: FlowGraph): any {
    const uiss = this.uiStateStore
    const oss = this.oss

    const data = {
      nodes: graph.nodes,
      edges: graph.edges
    }
    const options = {
      // FIXME: Normally the autoResize value should be set to true,
      //        but if this is done then we get a weird rendering effect
      //        on Firefox where the graph moves automatically and extends
      //        out of the analyse view
      autoResize: false,
      nodes: {
        shadow: true,
        color: {
          background: "white"
        },
        borderWidth: 0,
        shapeProperties: {
          useBorderWithImage: true
        }
      },
      edges: {
        width: 2,
        shadow: true
      },
      physics: {
        repulsion: {
          nodeDistance: 50
        },
        maxVelocity: 5
      },

      layout: {
        hierarchical: {
          enabled: true,
          direction: "UD",
          sortMethod: "directed"
        }
      },
      manipulation: {
        enabled: false,
        initiallyActive: false,
        addNode: false,
        deleteNode: false,
        editEdge: false,
        addEdge: function(visdata: any, callback: any) {
          if (visdata.from === visdata.to) {
            return
          } else {
            oss.dispatch({
              type: SELECT_ENTITY,
              payload: {
                id: data.from,
                type: EntityType.PROCESSOR
              }
            })
            oss.dispatch({
              type: SELECT_PROCESSOR_TO_CONNECT,
              payload: { id: data.to }
            })
            uiss.isRelationshipsSettingsDialogVisible = true
            return
          }
        }
      }
    }
    let network = this.ngZone.runOutsideAngular(
      () => new vis.Network(el, data, options)
    )

    this.oss.connectMode$().subscribe((connectMode: boolean) => {
      if (connectMode) network.addEdgeMode()
      else network.disableEditMode()
    })

    network.on("resize", function(params: any) {
      this.fit()
    })

    network.on(
      "click",
      function(params: any) {
        let selectedNodes = params.nodes
        let selectedEdges = params.edges

        if (selectedNodes.length > 0) {
          let pid = selectedNodes[0]
          oss.dispatch({
            type: SELECT_ENTITY,
            payload: {
              id: pid,
              type: EntityType.PROCESSOR
            }
          })
        } else if (selectedEdges.length > 0) {
          let cid = selectedEdges[0]
          oss.dispatch({
            type: SELECT_ENTITY,
            payload: {
              id: cid,
              type: EntityType.CONNECTION
            }
          })
        } else {
          oss.dispatch({
            type: SELECT_ENTITY,
            payload: {
              id: this.oss.activeFlowTab().flowInstance.id,
              type: EntityType.FLOW_INSTANCE
            }
          })
        }
      }.bind(this)
    )

    return network
  }
}
