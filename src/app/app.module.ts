import { ApiHttpService, Health } from "./http/api-http.service"
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic"
import { ModuleWithProviders, NgModule, APP_INITIALIZER } from "@angular/core"
import { HttpModule, Http } from "@angular/http"
import { AppComponent } from "./app.component"

import { BrowserModule } from "@angular/platform-browser"
import { DataTableModule, SharedModule } from "primeng/primeng"
import { OverlayPanelModule } from "primeng/components/overlaypanel/overlaypanel"
import { MultiSelectModule } from "primeng/components/multiselect/multiselect"
import { DropdownModule } from "primeng/components/dropdown/dropdown"
import { SelectButtonModule } from "primeng/components/selectbutton/selectbutton"
import { InputTextModule } from "primeng/components/inputtext/inputtext"
import { ButtonModule } from "primeng/components/button/button"
import { PaginatorModule } from "primeng/components/paginator/paginator"
import { OrderListModule } from "primeng/components/orderlist/orderlist"
import { MessagesModule } from "primeng/components/messages/messages"
import { MenubarModule } from "primeng/components/menubar/menubar"
import { MenuModule } from "primeng/components/menu/menu"
import { MegaMenuModule } from "primeng/components/megamenu/megamenu"
import { ListboxModule } from "primeng/components/listbox/listbox"
import { LightboxModule } from "primeng/components/lightbox/lightbox"
import { InputTextareaModule } from "primeng/components/inputtextarea/inputtextarea"
import { InputSwitchModule } from "primeng/components/inputswitch/inputswitch"
import { DataGridModule } from "primeng/components/datagrid/datagrid"
import { ContextMenuModule } from "primeng/components/contextmenu/contextmenu"
import { CodeHighlighterModule } from "primeng/components/codehighlighter/codehighlighter"
import { CheckboxModule } from "primeng/components/checkbox/checkbox"
import { ChartModule } from "primeng/components/chart/chart"
import { CarouselModule } from "primeng/components/carousel/carousel"
import { CalendarModule } from "primeng/components/calendar/calendar"
import { BreadcrumbModule } from "primeng/components/breadcrumb/breadcrumb"
import { AutoCompleteModule } from "primeng/components/autocomplete/autocomplete"
import { AccordionModule } from "primeng/components/accordion/accordion"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { DataListModule } from "primeng/components/datalist/datalist"
import { DataScrollerModule } from "primeng/components/datascroller/datascroller"
import { DialogModule } from "primeng/components/dialog/dialog"
import { DragDropModule } from "primeng/components/dragdrop/dragdrop"
import { EditorModule } from "primeng/components/editor/editor"
import { FieldsetModule } from "primeng/components/fieldset/fieldset"
import { GalleriaModule } from "primeng/components/galleria/galleria"
import { GMapModule } from "primeng/components/gmap/gmap"
import { GrowlModule } from "primeng/components/growl/growl"
import { InputMaskModule } from "primeng/components/inputmask/inputmask"
import { PanelModule } from "primeng/components/panel/panel"
import { PanelMenuModule } from "primeng/components/panelmenu/panelmenu"
import { PasswordModule } from "primeng/components/password/password"
import { PickListModule } from "primeng/components/picklist/picklist"
import { ProgressBarModule } from "primeng/components/progressbar/progressbar"
import { RadioButtonModule } from "primeng/components/radiobutton/radiobutton"
import { RatingModule } from "primeng/components/rating/rating"
import { ScheduleModule } from "primeng/components/schedule/schedule"
import { SlideMenuModule } from "primeng/components/slidemenu/slidemenu"
import { SliderModule } from "primeng/components/slider/slider"
import { SpinnerModule } from "primeng/components/spinner/spinner"
import { SplitButtonModule } from "primeng/components/splitbutton/splitbutton"
import { TabMenuModule } from "primeng/components/tabmenu/tabmenu"
import { TabViewModule } from "primeng/components/tabview/tabview"
import { TerminalModule } from "primeng/components/terminal/terminal"
import { TieredMenuModule } from "primeng/components/tieredmenu/tieredmenu"
import { ToggleButtonModule } from "primeng/components/togglebutton/togglebutton"
import { ToolbarModule } from "primeng/components/toolbar/toolbar"
import { TooltipModule } from "primeng/components/tooltip/tooltip"
import { TreeModule } from "primeng/components/tree/tree"
import { TreeTableModule } from "primeng/components/treetable/treetable"

import { MapService } from "./visualise/map/map.service"
import { FlowGraphDirective } from "./analyse/flow-graph/flow-graph.directive"
import { VisualiseComponent } from "./visualise/visualise.component"
import { MobiliseComponent } from "./mobilise/mobilise.component"
import { AnalyseComponent } from "./analyse/analyse.component"
import { MapComponent } from "./visualise/map/map.component"
import { ChartComponent } from "./visualise/chart/chart.component"

import { FlowGraphService } from "./analyse/flow-graph/flow-graph.service"
import { RouterModule, Routes } from "@angular/router"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { AngularSplitModule } from "angular-split"
import { LayoutComponent } from "./layout/layout.component"
import { StoreModule } from "@ngrx/store"
import { WsViewComponent } from "./layout/ws-view/ws-view.component"
import { ResizeDirective } from "./layout/resize.directive"
import { FlowTabsComponent } from "./analyse/flow-tabs/flow-tabs.component"
import { ContentComponent } from "./mobilise/content/content.component"
import { FlowEntityComponent } from "./panel/flow-entity/flow-entity.component"
import { FlowEntityInfoComponent } from "./panel/flow-entity-info/flow-entity-info.component"
import { ProcessorSchemaComponent } from "./panel/processor-schema/processor-schema.component"
import { SchemaPanelComponent } from "./panel/schema/schema-panel.component"
import { SchemaPropertyComponent } from "./panel/schema-property/schema-property.component"
import { FieldsToMapComponent } from "./schema/fields-to-map/fields-to-map.component"
import { FieldActionsComponent } from "./schema/field-actions/field-actions.component"
import { RelationshipsComponent } from "./panel/relationships/relationships.component"
import { ProcessorService } from "./service/processor.service"
import { VisTabsComponent } from "./visualise/vis-tabs/vis-tabs.component"
import { FlowService } from "./analyse/service/flow.service"
import { ConnectionService } from "./analyse/service/connection.service"
import { UIStateStore } from "./state/ui.state.store"
import { DnDStore } from "./state/dnd.store"
import { KeycloakService } from "./service/keycloak.service"
import { ErrorService } from "./service/error.service"
import { NotificationService } from "./service/notification.service"
import { SchemaService } from "./service/schema.service"
import { ObservableState } from "./state/state"
import { rootReducer, NEW_MODAL_MESSAGE } from "./state/reducers"
import { ModalMessageComponent } from "./panel/modal-message/modal-message.component"
import { ModalMessage } from "./state/ui.models"
import { environment } from "../environments/environment"

export const routes: Routes = [{ path: "", component: LayoutComponent }]

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes)

export function startupServiceFactory(http: Http, uss: UIStateStore): Function {
  return () => {
    return http
      .get(environment.apiBaseUrl + "/api/health")
      .flatMap((healthResponse: any) =>
        http
          .get(environment.apiBaseUrl + "/api/cid")
          .map((response: any) => response.json())
          .map((cid: string) => {
            ApiHttpService.flowClientId = cid
          })
      )
      .toPromise()
      .catch((error: any) => {
        uss.isServerCheckSucessful = false
      })
  }
}

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    WsViewComponent,
    ResizeDirective,
    FlowTabsComponent,
    ContentComponent,
    VisualiseComponent,
    MobiliseComponent,
    AnalyseComponent,
    MapComponent,
    ChartComponent,
    VisTabsComponent,
    FlowGraphDirective,
    FlowEntityComponent,
    FlowEntityInfoComponent,
    ProcessorSchemaComponent,
    SchemaPanelComponent,
    SchemaPropertyComponent,
    FieldsToMapComponent,
    FieldActionsComponent,
    RelationshipsComponent,
    ModalMessageComponent
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: startupServiceFactory,
      deps: [Http, UIStateStore],
      multi: true
    },
    FlowService,
    ProcessorService,
    ConnectionService,
    UIStateStore,
    DnDStore,
    KeycloakService,
    ErrorService,
    NotificationService,
    MapService,
    FlowGraphService,
    SchemaService,
    ObservableState
  ],
  imports: [
    // Alambeek Imports follow ...
    StoreModule.forRoot(rootReducer),
    // Angular Imports follow ...
    BrowserAnimationsModule,
    HttpModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutes,
    // PrimeNG Imports follow
    AccordionModule,
    AutoCompleteModule,
    BreadcrumbModule,
    ButtonModule,
    CalendarModule,
    CarouselModule,
    ChartModule,
    CheckboxModule,
    CodeHighlighterModule,
    SharedModule,
    ContextMenuModule,
    DataGridModule,
    DataListModule,
    DataScrollerModule,
    DataTableModule,
    DialogModule,
    DragDropModule,
    DropdownModule,
    EditorModule,
    FieldsetModule,
    GalleriaModule,
    GMapModule,
    GrowlModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    LightboxModule,
    ListboxModule,
    MegaMenuModule,
    MenuModule,
    MenubarModule,
    MessagesModule,
    MultiSelectModule,
    OrderListModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelModule,
    PanelMenuModule,
    PasswordModule,
    PickListModule,
    ProgressBarModule,
    RadioButtonModule,
    RatingModule,
    ScheduleModule,
    SelectButtonModule,
    SlideMenuModule,
    SliderModule,
    SpinnerModule,
    SplitButtonModule,
    TabMenuModule,
    TabViewModule,
    TerminalModule,
    TieredMenuModule,
    ToggleButtonModule,
    ToolbarModule,
    TooltipModule,
    TreeModule,
    TreeTableModule,
    // Third Party import follow ...
    AngularSplitModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
