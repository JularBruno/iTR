import { Component } from '@angular/core';
import { ItemComponent } from '../../core/item.component';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-subproduct',
  templateUrl: './subproduct.component.html',
  styleUrls: ['../../core/item.component.scss']
})
export class SubproductComponent extends ItemComponent {
  products: any = [];

  initializePre() {
    this.loadProducts()
  }
  loadProducts() {
    let endPoint = this.settings.endPoints.products;
    this.pageService.httpSimpleGetAll(endPoint)
      .then(res => this.products = res.data)
      .catch(e => this.pageService.showError(e));
  }
  getFormNew() {
    return this.formBuilder.group({
      id: [null],
      name: [null, Validators.required],
      code: [null, Validators.required],
      price: [null, Validators.required],
      product: [null, Validators.required],

    })
  }

  getFormEdit(item) {
    return this.formBuilder.group({
      id: [item.id],
      name: [item.name, Validators.required],
      code: [item.code, Validators.required],
      price: [item.price, Validators.required],
      product: [item.product, Validators.required],

    })
  }
}
