import { Component } from '@angular/core';
import * as moment from 'moment';
import { ItemsComponent } from '../../core/items.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['../../core/items.component.scss']
})
export class OrdersComponent extends ItemsComponent {

  statusFilter: any;
  dateFrom = '';
  dateTo = '';

  handleStatusSelect(element) {
    this.statusFilter = element.value;
    this.getItems();
  }

  getFilters() {
    let _filters: {[k: string]: any} = {};
    let dateFrom = moment(this.dateFrom).startOf('day').toISOString();
    let dateTo = moment(this.dateTo).endOf('day').toISOString();

    if (this.statusFilter) _filters.status = this.statusFilter;

    if (this.dateFrom && !this.dateTo) _filters.paymentDate = { $gte: dateFrom };

    if (this.dateTo && !this.dateFrom) _filters.paymentDate = { $lte: dateTo };
    
    if (this.dateFrom && this.dateTo) _filters.paymentDate = {
      $gte: dateFrom,
      $lte: dateTo
    };

    return _filters;
  }

  getFiltersSearch(textSearch) {

    let filtersSearch: any = {
      "$or": [
        { "name": { "$regex": textSearch, "$options": "i" } },
      ]
    };

    return filtersSearch;
  }

  

}
