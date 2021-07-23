import { Component } from '@angular/core';
import { ItemsComponent } from '../../core/items.component';

@Component({
  selector: 'app-dolars',
  templateUrl: './dolars.component.html',
  styleUrls: ['../../core/items.component.scss']
})
export class DolarsComponent extends ItemsComponent {
  dolar: any

  updateDolar() {
    if (this.items.length == 0) {
      this.pageService.httpCreate({ value: this.dolar }).then(res => {
        this.pageService.showSuccess("Se ha creado correctamente")
      })
    } else {
      this.pageService.httpUpdate({ value: this.dolar, id: this.items[0].id }).then(res => {
        this.pageService.showSuccess("Se ha actualizado correctamente")
      })
    }
    // this.pageService.
  }

  getItemSuccess() {
    console.log(this.items)
    if (this.items.length > 0) this.dolar = this.items[0].value
  }
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
}
