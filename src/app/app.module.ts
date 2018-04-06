import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { App } from "./app.component";
import { ErrorService } from "./shared/util/error.service";
import { FlowService } from "./service/flow.service";
import { BrowserModule } from "@angular/platform-browser";
import { DataTableModule, SharedModule } from "primeng/primeng";
import { OverlayPanelModule } from "primeng/components/overlaypanel/overlaypanel";
import { MultiSelectModule } from "primeng/components/multiselect/multiselect";
import { DropdownModule } from "primeng/components/dropdown/dropdown";
import { SelectButtonModule } from "primeng/components/selectbutton/selectbutton";
import { InputTextModule } from "primeng/components/inputtext/inputtext";
import { ButtonModule } from "primeng/components/button/button";
import { PaginatorModule } from "primeng/components/paginator/paginator";
import { OrderListModule } from "primeng/components/orderlist/orderlist";
import { MessagesModule } from "primeng/components/messages/messages";
import { MenubarModule } from "primeng/components/menubar/menubar";
import { MenuModule } from "primeng/components/menu/menu";
import { MegaMenuModule } from "primeng/components/megamenu/megamenu";
import { ListboxModule } from "primeng/components/listbox/listbox";
import { LightboxModule } from "primeng/components/lightbox/lightbox";
import { InputTextareaModule } from "primeng/components/inputtextarea/inputtextarea";
import { InputSwitchModule } from "primeng/components/inputswitch/inputswitch";
import { DataGridModule } from "primeng/components/datagrid/datagrid";
import { ContextMenuModule } from "primeng/components/contextmenu/contextmenu";
import { CodeHighlighterModule } from "primeng/components/codehighlighter/codehighlighter";
import { CheckboxModule } from "primeng/components/checkbox/checkbox";
import { ChartModule } from "primeng/components/chart/chart";
import { CarouselModule } from "primeng/components/carousel/carousel";
import { CalendarModule } from "primeng/components/calendar/calendar";
import { BreadcrumbModule } from "primeng/components/breadcrumb/breadcrumb";
import { AutoCompleteModule } from "primeng/components/autocomplete/autocomplete";
import { AccordionModule } from "primeng/components/accordion/accordion";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataListModule } from "primeng/components/datalist/datalist";
import { DataScrollerModule } from "primeng/components/datascroller/datascroller";
import { DialogModule } from "primeng/components/dialog/dialog";
import { DragDropModule } from "primeng/components/dragdrop/dragdrop";
import { EditorModule } from "primeng/components/editor/editor";
import { FieldsetModule } from "primeng/components/fieldset/fieldset";
import { GalleriaModule } from "primeng/components/galleria/galleria";
import { GMapModule } from "primeng/components/gmap/gmap";
import { GrowlModule } from "primeng/components/growl/growl";
import { InputMaskModule } from "primeng/components/inputmask/inputmask";
import { PanelModule } from "primeng/components/panel/panel";
import { PanelMenuModule } from "primeng/components/panelmenu/panelmenu";
import { PasswordModule } from "primeng/components/password/password";
import { PickListModule } from "primeng/components/picklist/picklist";
import { ProgressBarModule } from "primeng/components/progressbar/progressbar";
import { RadioButtonModule } from "primeng/components/radiobutton/radiobutton";
import { RatingModule } from "primeng/components/rating/rating";
import { ScheduleModule } from "primeng/components/schedule/schedule";
import { SlideMenuModule } from "primeng/components/slidemenu/slidemenu";
import { SliderModule } from "primeng/components/slider/slider";
import { SpinnerModule } from "primeng/components/spinner/spinner";
import { SplitButtonModule } from "primeng/components/splitbutton/splitbutton";
import { TabMenuModule } from "primeng/components/tabmenu/tabmenu";
import { TabViewModule } from "primeng/components/tabview/tabview";
import { TerminalModule } from "primeng/components/terminal/terminal";
import { TieredMenuModule } from "primeng/components/tieredmenu/tieredmenu";
import { ToggleButtonModule } from "primeng/components/togglebutton/togglebutton";
import { ToolbarModule } from "primeng/components/toolbar/toolbar";
import { TooltipModule } from "primeng/components/tooltip/tooltip";
import { TreeModule } from "primeng/components/tree/tree";
import { TreeTableModule } from "primeng/components/treetable/treetable";
import { KeycloakService } from "./shared/keycloak.service";
import { UIStateStore } from "./shared/ui.state.store";
import { MapService } from "./visualise/map/map.service";
import { ResizeDirective } from "./shared/layout/resize.directive";
import { WsViewComponent } from "./shared/layout/ws-view.component";
import { FlowTabsComponent } from "./analyse/flow-tabs.component";
import { FlowGraphDirective } from "./analyse/flow-graph/flow-graph.directive";
import { ContentComponent } from "./mobilise/content.component";
import { VisualiseComponent } from "./visualise/visualise.component";
import { MobiliseComponent } from "./mobilise/mobilise.component";
import { AnalyseComponent } from "./analyse/analyse.component";
import { MapComponent } from "./visualise/map/map.component";
import { ChartComponent } from "./visualise/chart/chart.component";
import { VisTabsComponent } from "./visualise/vis-tabs.component";
import { FlowGraphService } from "./analyse/flow-graph/flow-graph.service";
import { RouterModule, Routes } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularSplitModule } from "angular-split";
import { LayoutComponent } from "./layout/layout.component";
import { ContextStore } from "./shared/context.store";
import { FlowEntityComponent } from "./shared/flow-entity.component";
import { FlowEntityInfoComponent } from "./shared/flow-entity-info.component";
import { ProcessorSchemaComponent } from "./shared/processor-schema.component";
import { SchemaPanelComponent } from "./shared/schema-panel.component";
import { SchemaService } from "./service/schema.service";
import { SchemaPropertyComponent } from "./shared/schema-property.component";
import { NotificationService } from "./shared/util/notification.service";
import { FieldsToMapComponent } from "./shared/schema/fields-to-map.component";
import { FieldActionsComponent } from "./shared/schema/field-actions.component";
import { DnDStore } from "./shared/dnd.store";
import { rootReducer } from "./store/reducers";
import { StoreModule } from "@ngrx/store";
import { ObservableState } from "./store/state";
import { ProcessorService } from "./service/processor.service";
import { RelationshipsComponent } from "./shared/relationships.component";
import { ConnectionService } from "./service/connection.service";

export const routes: Routes = [{ path: "", component: LayoutComponent }];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes);

@NgModule({
  declarations: [
    App,
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
    RelationshipsComponent
  ],
  providers: [
    { provide: Window, useValue: window },
    FlowService,
    ProcessorService,
    ConnectionService,
    UIStateStore,
    DnDStore,
    ContextStore,
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
    StoreModule.provideStore(rootReducer),
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
  bootstrap: [App]
})
export class AppModule {}

KeycloakService.init().subscribe(
  () => {
    platformBrowserDynamic().bootstrapModule(AppModule);
  },
  (error: any) => console.log(error)
);
