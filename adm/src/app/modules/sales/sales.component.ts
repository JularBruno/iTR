import { Component } from '@angular/core';
import { ItemsComponent } from '../../core/items.component';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  // styleUrls: ['../../core/items.component.scss']
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent extends ItemsComponent {
  showPriceChange: Boolean = false
  price: any
  getFilters() {
    let _filters = {};
    return _filters;
  }
  getPopulates() {
    return ["client"]
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
