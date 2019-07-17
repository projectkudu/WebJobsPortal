import { DashboardType } from 'app/tree-view/models/dashboard-type';
import { Component, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SlotsNode } from '../tree-view/slots-node';
import { SlotNode } from '../tree-view/app-node';
import { PortalResources } from '../shared/models/portal-resources';
import { errorIds } from '../shared/models/error-ids';
import { NavigableComponent, ExtendedTreeViewInfo } from '../shared/components/navigable-component';
import { Observable } from 'rxjs/Observable';

interface SlotItem {
  name: string;
  status: string;
  serverFarm: string;
  node: SlotNode;
}

@Component({
  selector: 'slots-list',
  templateUrl: './slots-list.component.html',
  styleUrls: ['./slots-list.component.scss'],
})
export class SlotsListComponent extends NavigableComponent {
  public slots: SlotItem[] = [];
  public isLoading: boolean;

  private _slotsNode: SlotsNode;
  constructor(private _translateService: TranslateService, injector: Injector) {
    super('slots-list', injector, DashboardType.SlotsDashboard);
  }

  setup(navigationEvents: Observable<ExtendedTreeViewInfo>): Observable<any> {
    return super
      .setup(navigationEvents)
      .takeUntil(this.ngUnsubscribe)
      .switchMap(viewInfo => {
        this.clearBusyEarly();
        this.isLoading = true;
        this._slotsNode = <SlotsNode>viewInfo.node;
        return this._slotsNode.loadChildren();
      })
      .do(null, e => {
        this.isLoading = false;
        this.showComponentError({
          message: this._translateService.instant(PortalResources.error_unableToLoadSlotsList),
          errorId: errorIds.unableToPopulateSlotsList,
          resourceId: 'none',
        });
      })
      .do(() => {
        this.isLoading = false;
        this.slots = (<SlotNode[]>this._slotsNode.children).map(s => {
          return <SlotItem>{
            name: s.title,
            status: s.slotProperties.state,
            serverFarm: s.slotProperties.serverFarmId.split('/')[8],
            node: s,
          };
        });
      });
  }

  clickRow(item: SlotItem) {
    item.node.select();
  }
}
