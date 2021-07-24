import { Component, ViewChild, ElementRef } from '@angular/core';
import { ItemsComponent } from '../../core/items.component';
import * as moment from "moment"

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  // styleUrls: ['../../core/items.component.scss']
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent extends ItemsComponent {
  showPriceChange: Boolean = false
  price: any
  date: any
  paidARS: any = 0
  paidUSD: any = 0
  showProductInterface: boolean = false;
  scannerEnabled: boolean = false;
  products: any = [];
  product: any
  name: any
  stock: any
  priceSub: any
  subproducts: any = [];
  code: any
  @ViewChild('pdfTable') pdfTable: ElementRef;
  preOpenModal() {
    this.getProducts();
    this.getSaleSubProducts()
  }
  getSaleSubProducts() {
    this.pageService.httpSimpleGetAll(this.global.settings.endPoints.subproducts, false, {}, { isFromSale: true, sale: this.itemSelected.id }).then(res => {
      this.subproducts = res.data
    })
  }
  getProducts() {
    this.pageService.httpSimpleGetAll(this.global.settings.endPoints.products).then(res => {
      console.log(res)
      this.products = res.data
    })
  }
  payARS() {
    let update = {
      $inc: { paidARS: this.paidARS },
      id: this.itemSelected.id
    }
    this.pageService.httpUpdate(update, this.settings.endPoints.sales).then(async res => {
      await this.getItemSelected()
    })
  }

  payUSD() {
    let update = {
      $inc: { paidUSD: this.paidUSD },
      id: this.itemSelected.id
    }
    this.pageService.httpUpdate(update, this.settings.endPoints.sales).then(async res => {
      await this.getItemSelected()
    })
  }
  async getItemSelected() {
    let item = await this.pageService.httpGetById(this.itemSelected.id, ["client"])
    this.itemSelected = item.data
  }
  createSubProduct() {
    if (!this.name || !this.code || !this.product || !this.priceSub || !this.stock) return this.pageService.showError("Ingrese todos los datos para cargar el subproducto")
    let subproduct = {
      name: this.name,
      code: this.code,
      product: this.product,
      stock: this.stock,
      price: this.priceSub,
      isFromSale: true,
      sale: this.itemSelected.id
    }
    this.pageService.httpPost(subproduct, "", this.global.settings.endPoints.subproducts).then(res => {
      console.log(res, "CREATED SUBPRODUCT")
      let sale = {
        id: this.itemSelected.id,
        $inc: { paidPROD: subproduct.price * subproduct.stock }

      }
      this.pageService.httpUpdate(sale).then(res => {
        this.getItemSelected()
        this.preOpenModal()
        this.name = this.code = this.product = this.stock = this.price = undefined
      })
      this.pageService.showSuccess("Se ha agregado el producto a la venta exitosamente")
    })
  }
  displayProductLoad() {
    this.showProductInterface = true
  }
  getFilters() {
    let createdAt: any = {};
    console.log(this.date)
    let _filters = {};
    if (this.date) {
      const end = moment(this.date).endOf('day').toDate()
      const start = moment(this.date).startOf('day').toDate()
      createdAt["$gte"] = start;
      createdAt["$lte"] = end;
      _filters['createdAt'] = createdAt;
    }
    if (this.price) {
      _filters["total"] = this.price
    }
    console.log(_filters, "filter")
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


  enableScanner() {
    this.scannerEnabled = !this.scannerEnabled;
    if (this.scannerEnabled) {
      // this.form.controls['code'].disable();
    } else {
      // this.form.controls['code'].enable();
    }
  }

  scanSuccessHandler(event) {
    console.log(event, "event scanner")
    // this.form.value.code = event;
  }

  getTop(i) {
    return 323 + i * 26;
  }

  getTopHr(i) {
    return 334 + i * 37;
  }


}
