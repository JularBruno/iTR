import { Component } from '@angular/core';
import { ItemsComponent } from '../../core/items.component';
import * as moment from 'moment'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['../../core/items.component.scss']
})
export class UsersComponent extends ItemsComponent {

  getFiltersSearch(textSearch) {

    let filtersSearch: any = {
      "$or": [
        { "firstName": { "$regex": textSearch, "$options": "i" } }
      ]
    };

    return filtersSearch;
  }

  toRider(user) {
    let endPoint = this.settings.endPoints.users + this.settings.endPoints.toRider;
    this.pageService.httpUpdate(user, endPoint)
    .then((res) => {
      this.pageService.showSuccess(res.data.message)
      this.getItems();
    })
    .catch((error) => {
      console.log(error);
      this.pageService.showError(error);
    })
    
  }

  isRider(item) {
    if( item.roles.includes('rider')){
      return true;
    }
    else {
      return false;
    }
  }

  handleEnable(item) {
    item.enabled = !item.enabled;

    this.pageService.httpUpdate(item)
    .then(res => this.pageService.showSuccess('El usuario "' + item.username + '" ha sido ' + (item.enabled ? 'habilitado' : 'deshabilitado') + ' correctamente!'))
    .catch(e => this.pageService.showError(e));
  }


}
