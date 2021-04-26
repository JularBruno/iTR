import { Component } from '@angular/core';
import { ItemsComponent } from '../../core/items.component';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['../../core/items.component.scss']
})
export class CouponsComponent extends ItemsComponent {


  handleEnable(coupon) {
    let companyPopulate = coupon.company;

    this.itemSelected = coupon;
    this.itemSelected.enabled = !coupon.enabled;
    this.itemSelected.company = coupon.company.id;

    this.pageService.httpUpdate(this.itemSelected)
    .then(res => {
      coupon.company = companyPopulate;
      this.pageService.showSuccess('El cupón "' + coupon.name + '" ha sido ' + (this.itemSelected.enabled ? 'habilitado' : 'deshabilitado') + ' correctamente!')
    }).catch(e => this.pageService.showError(e));
  }

  getPopulates() {
    return ['company'];
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
