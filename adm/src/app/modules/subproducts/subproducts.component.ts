import { Component } from '@angular/core';
import { ItemsComponent } from '../../core/items.component';

@Component({
  selector: 'app-subproducts',
  templateUrl: './subproducts.component.html',
  styleUrls: ['../../core/items.component.scss']
})
export class SubproductsComponent extends ItemsComponent {


  getFilters() {
    let _filters = {};
    return _filters;
  }

  getPopulates() {
    return ["product"]
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
