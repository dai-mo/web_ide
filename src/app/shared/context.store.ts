import {Injectable, NgZone} from "@angular/core"
import {BehaviorSubject, Observable} from "rxjs/Rx"
import {ContextBarItem, ContextMenuItem} from "./ui.models"

/**
 * Created by cmathew on 04.05.17.
 */

@Injectable()
export class ContextStore {



  constructor(private ngZone: NgZone) {}

  obs(key: string, obsMap: Map<string, BehaviorSubject<any[]>>): Observable<ContextMenuItem[]> {
    if(!obsMap.has(key)) {
      this.addContext(key, [], obsMap)
    }
    return obsMap.get(key).asObservable()
  }

  addContext(key: string, items: any[], obsMap: Map<string, BehaviorSubject<any[]>>) {
    let _context: BehaviorSubject<any[]>

    if(obsMap.has(key)) {
      _context = obsMap.get(key)
    } else {
      _context = new BehaviorSubject(items)
      obsMap.set(key, _context)
    }

    this.ngZone.run(() => _context.next(items))
  }

  addContextItems(key: string, items: any[], obsMap: Map<string, BehaviorSubject<any[]>>) {
    let _context = obsMap.get(key)
    let currentItems = _context.getValue()
    items.forEach(mci => currentItems.push(mci))
    this.ngZone.run(() => _context.next(_context.getValue()))
  }

  removeContextItems(key: string, items: any[], obsMap: Map<string, BehaviorSubject<any[]>>) {
    let _context = obsMap.get(key)
    let currentCMItems = _context.getValue()
    items.forEach(mci => {
      let index = currentCMItems.indexOf(mci)
      currentCMItems.splice(index, 1)
    })
    this.ngZone.run(() => _context.next(_context.getValue()))
  }

  private contextMenuItemsObsMap: Map<string, BehaviorSubject<ContextMenuItem[]>> =
    new Map<string, BehaviorSubject<ContextMenuItem[]>>()

  contextMenuObs(key: string): Observable<ContextMenuItem[]> {
    return this.obs(key, this.contextMenuItemsObsMap)
  }

  addContextMenu(key: string, cmItems: ContextMenuItem[]) {
    this.addContext(key, cmItems, this.contextMenuItemsObsMap)
  }

  addContextMenuItems(key: string, cmItems: ContextMenuItem[]) {
    this.addContextItems(key, cmItems, this.contextMenuItemsObsMap)
  }

  removeContextMenuItems(key: string, cmItems: ContextMenuItem[]) {
    this.removeContextItems(key, cmItems, this.contextMenuItemsObsMap)
  }

  private contextBarItemsObsMap: Map<string, BehaviorSubject<ContextBarItem[]>> =
    new Map<string, BehaviorSubject<ContextBarItem[]>>()

  contextBarObs(key: string): Observable<ContextBarItem[]> {
    return this.obs(key, this.contextBarItemsObsMap)
  }

  addContextBar(key: string, cbItems: ContextBarItem[]) {
    this.addContext(key, cbItems, this.contextBarItemsObsMap)
  }

  addContextBarItems(key: string, cbItems: ContextBarItem[]) {
    this.addContextItems(key, cbItems, this.contextBarItemsObsMap)
  }

  removeContextBarItems(key: string, cbItems: ContextBarItem[]) {
    this.removeContextItems(key, cbItems, this.contextBarItemsObsMap)
  }

  getContextBarItems(key: string): ContextBarItem[] {
    if(this.contextBarItemsObsMap.has(key))
      return this.contextBarItemsObsMap.get(key).getValue()
    return []
  }

}
