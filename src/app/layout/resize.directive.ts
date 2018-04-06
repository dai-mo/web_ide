/**
 * Created by cmathew on 13/07/16.
 */
import {Directive, ElementRef, Input, Renderer2} from "@angular/core"
import {UIStateStore} from "../ui.state.store"

@Directive({
  selector: "[resize]"
})
export class ResizeDirective {

  private el:HTMLElement

  private dragFunction: Function
  private endDragFunction: Function

  private resizeType:string
  private dragging: boolean

  private start:number

  private prevElm: HTMLElement
  private prevElmWidth: number
  private prevElmHeight: number
  private prevElmPanelHeadingHeight: number
  private prevElmStyle: CSSStyleDeclaration
  private prevElmPanelHeading: HTMLElement
  private prevElmPanelBody: HTMLElement
  private prevElmStartFlexBasis: number

  private nextElm: HTMLElement
  private nextElmWidth: number
  private nextElmHeight: number
  private nextElmPanelHeadingHeight: number
  private nextElmStyle: CSSStyleDeclaration
  private nextElmPanelHeading: HTMLElement
  private nextElmPanelBody: HTMLElement
  private nextElmStartFlexBasis: number

  constructor(elementRef: ElementRef,
              private renderer: Renderer2,
              private uiStateStore: UIStateStore) {
    this.el = elementRef.nativeElement
  }

  private init() {
    let siblings = this.el.parentElement.children
    if (siblings.length !== 3) {
      alert("Flex container contains incorrect number of children")
      return
    }
    this.prevElm = siblings[0] as HTMLElement
    this.nextElm = siblings[2] as HTMLElement
  }

  private initProperties() {

    this.prevElmStyle = window.getComputedStyle(this.prevElm, null)
    this.prevElmWidth = parseInt(this.prevElmStyle.width)
    this.prevElmHeight = parseInt(this.prevElmStyle.height)
    this.prevElmStartFlexBasis = parseInt(this.prevElmStyle.flexBasis)

    this.nextElmStyle = window.getComputedStyle(this.nextElm, null)
    this.nextElmWidth = parseInt(this.nextElmStyle.width)
    this.nextElmHeight = parseInt(this.nextElmStyle.height)
    this.nextElmStartFlexBasis = parseInt(this.nextElmStyle.flexBasis)
  }

  private initPanelProperties() {

    let prevElemChildren: HTMLCollection = this.prevElm.children
    let nextElemChildren: HTMLCollection = this.nextElm.children

    if(this.resizeType !== "column") {
      // this will be true in the case of the row flex box
      return
    }
    this.prevElmPanelHeading = prevElemChildren[0] as HTMLElement
    let prevElmPanelHeadingStyle = window.getComputedStyle(this.prevElmPanelHeading, null)
    this.prevElmPanelHeadingHeight = parseInt(prevElmPanelHeadingStyle.height)
    this.prevElmPanelBody = prevElemChildren[1] as HTMLElement

    this.nextElmPanelHeading = nextElemChildren[0] as HTMLElement
    let nextElmPanelHeadingStyle = window.getComputedStyle(this.nextElmPanelHeading, null)
    this.nextElmPanelHeadingHeight = parseInt(nextElmPanelHeadingStyle.height)
    this.nextElmPanelBody = nextElemChildren[1] as HTMLElement

    this.updateFlexBasis(0)
  }

  private updatePanelProperties(prevHeight: number, nextHeight: number) {
    this.renderer.setStyle(this.prevElmPanelBody, "height", prevHeight + "px")
    this.renderer.setStyle(this.prevElmPanelBody, "min-height", prevHeight + "px")

    this.renderer.setStyle(this.nextElmPanelBody, "height", nextHeight + "px")
    this.renderer.setStyle(this.nextElmPanelBody, "min-height", nextHeight + "px")
  }

  private endDrag() {
    this.dragging = false

    this.dragFunction()
    this.endDragFunction()
  }

  private updateFlexBasis(offset: number) {

    let prevFlexBasis = 1, nextFlexBasis = 1
    switch (this.resizeType) {
      case "column":
        prevFlexBasis = this.prevElmHeight - offset
        nextFlexBasis = this.nextElmHeight + offset
        break
      case "row":
        prevFlexBasis = this.prevElmWidth - offset
        nextFlexBasis = this.nextElmWidth + offset
        break
    }

    this.renderer.setStyle(this.prevElm, "flex-basis", prevFlexBasis + "px")
    this.renderer.setStyle(this.nextElm, "flex-basis", nextFlexBasis + "px")

    if (this.resizeType === "column" &&
      this.nextElmPanelHeadingHeight < nextFlexBasis &&
      this.prevElmPanelHeadingHeight < prevFlexBasis) {
      this.updatePanelProperties(prevFlexBasis - this.prevElmPanelHeadingHeight,
        nextFlexBasis - this.nextElmPanelHeadingHeight)
    }
  }

  private drag(event: MouseEvent) {
    if(!this.dragging) return

    this.uiStateStore.setResizeView(event)

    let offset = 0
    switch (this.resizeType) {
      case "column":
        offset = this.start - event.clientY
        this.updateFlexBasis(offset)
        break
      case "row":
        offset = this.start - event.clientX
        this.updateFlexBasis(offset)
        break
    }
  }

  private startDrag(event: MouseEvent) {

    // This is to prevent text selection on drag
    event.preventDefault()

    switch(this.resizeType) {
      case "column":
        this.start = event.clientY
        break
      case "row":
        this.start = event.clientX
        break
      default:
        return
    }


    this.dragging = true
    this.init()
    this.initProperties()

    let self = this
    this.dragFunction = this.renderer.listen("document", "mousemove", (event: MouseEvent) => {
      self.drag(event)
    })

    this.endDragFunction = this.renderer.listen("document", "mouseup", (event: MouseEvent) => {
      self.endDrag()
    })
  }


  @Input() set type(type: string) {
    let self = this
    this.resizeType = type
    this.init()
    this.initProperties()
    this.initPanelProperties()
    this.el.onmousedown = function(event: MouseEvent) {
      if(event.which === 1) {
        self.startDrag(event)
      }
    }
  }
}