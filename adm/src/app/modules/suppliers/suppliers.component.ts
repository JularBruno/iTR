import { Component } from '@angular/core';
import { ItemsComponent } from '../../core/items.component';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['../../core/items.component.scss']
})
export class SuppliersComponent extends ItemsComponent {

  price: any
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
  
  applyDebt() {
    if (!this.price) return this.pageService.showError("Ingrese un monto")
    console.log(-Math.abs(this.price))
    let item = {
      id: this.itemSelected.id,
      $inc: { debt: -Math.abs(this.price) }
    }
    let endpoint = this.settings.endPoints.suppliers
    this.pageService.httpUpdate(item, endpoint).then(res => {
      this.pageService.showSuccess("Se ha impactado con exito")
      this.getItems()
      this.closeModal()
    })
  }
}
