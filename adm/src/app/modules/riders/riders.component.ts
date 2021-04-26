import { Component } from '@angular/core';
import { ItemsComponent } from '../../core/items.component';

@Component({
  selector: 'app-riders',
  templateUrl: './riders.component.html',
  styleUrls: ['../../core/items.component.scss']
})
export class RidersComponent extends ItemsComponent {

  endPoint = this.settings.endPoints.users;

  handleEnable(item) {
    item.riderEnabled = !item.riderEnabled;

    this.pageService.httpUpdate(item, this.endPoint)
    .then(res => this.pageService.showSuccess('El usuario "' + item.username + '" ha sido ' + (item.riderEnabled ? 'habilitado' : 'deshabilitado') + ' como Rider correctamente!'))
    .catch(e => this.pageService.showError(e));
  }

  getFilters() {
    let _filters = {
      roles: 'rider'
    };

    return _filters;
  }

  getFiltersSearch(textSearch) {

    let filtersSearch: any = {
      "$or": [
        { "workshop.name": { "$regex": textSearch, "$options": "i" } },
        { "bikeModel": { "$regex": textSearch, "$options": "i" } },

      ]
    };

    return filtersSearch;
  }

  // getPopulates() {
  //   return ['user','workshop']
  // }
}
