import { Component } from '@angular/core';
import { ItemsComponent } from '../../core/items.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['../../core/items.component.scss']
})
export class ProductsComponent extends ItemsComponent {
  showPriceChange: Boolean = false
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

  showPriceChangeFunct() {
    this.showPriceChange = !this.showPriceChange
  }

  selectProduct(product, event) {
    let index = this.items.findIndex((item) => item == product)
    this.items[index].selected = event
  }

  updatePrice() {
    if (!this.price) return this.pageService.showError("Ingrese un porcentaje")
    let toupdate = this.items.filter(item => (item.selected == true))
    let products = []
    for (let index = 0; index < toupdate.length; index++) {
      const element = toupdate[index];
      products.push(element.id)
    }
    if (products.length == 0) return this.pageService.showError("Seleccione al menos un producto")
    let method = this.settings.endPointsMethods.updatePrice
    let item = { products: products, amount: this.price }
    this.pageService.httpPost(item, method).then(res => {
      this.showPriceChange = false
      alert('Costos actualizados!');
    })
  }

  getEndPoint() {
    return this.settings.endPoints.products + this.settings.endPointsMethods.subproducts
  }
}
