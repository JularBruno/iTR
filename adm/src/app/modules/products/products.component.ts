import { Component } from '@angular/core';
import { ItemsComponent } from '../../core/items.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['../../core/items.component.scss']
})
export class ProductsComponent extends ItemsComponent {


  getFilters() {
    let _filters = {};
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
  getEndPoint() {
    return this.settings.endPoints.products + this.settings.endPointsMethods.subproducts
  }
}
