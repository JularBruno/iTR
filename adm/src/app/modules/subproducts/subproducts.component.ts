import { Component } from '@angular/core';
import { ItemsComponent } from '../../core/items.component';

@Component({
  selector: 'app-subproducts',
  templateUrl: './subproducts.component.html',
  styleUrls: ['../../core/items.component.scss']
})
export class SubproductsComponent extends ItemsComponent {
  suppliers: any = [];
  amount: any
  price: any
  supplier: any
  transactionsArray: any = [];

  getFilters() {
    let _filters = {};
    return _filters;
  }

  getPopulates() {
    return ["product"]
  }

  getItemSuccess() {
    this.getSuppliers()
  }

  getFiltersSearch(textSearch) {

    let filtersSearch: any = {
      "$or": [
        { "name": { "$regex": textSearch, "$options": "i" } },
      ]
    };

    return filtersSearch;
  }

  getSuppliers() {
    let endPoint = this.settings.endPoints.suppliers;
    this.pageService.httpSimpleGetAll(endPoint)
      .then(res => this.suppliers = res.data)
      .catch(e => this.pageService.showError(e));
  }
  addStock() {
    let item = {
      subproduct: this.itemSelected.id,
      stock: this.amount,
      price: this.price,
      supplier: this.supplier,
      type: "add"
    }
    console.log(item)
    let endPoint = this.settings.endPoints.subproducts

    this.pageService.httpPost(item, this.settings.endPointsMethods.addStock, endPoint).then(res => {
      this.getItems()
      this.closeModal()
    }).catch(e => {
      this.pageService.showError("Ha ocurrido un error, intente mas tarde")
    })
  }
  deleteTransaction(item) {
    let endPoint = this.settings.endPoints.subproducts;
    let method = this.settings.endPointsMethods.substractStock + "/" + item.id;
    item.type = "substract"
    item.supplier = item.supplier.id
    this.pageService.httpPost(item, method, endPoint).then(res => {
      console.log("done")
      this.loadTransactions(this.itemSelected.id)
      this.getItems()
    })
  }
  loadTransactions(item) {
    let endPoint = this.settings.endPoints.transactions;

    this.pageService.httpSimpleGetAll(endPoint, false, {}, { subproduct: item.id, type: "add" }, ["supplier"]).then(res => {
      this.transactionsArray = res.data
    })
  }
  loadTransactionsOpenModal(content, item) {
    let endPoint = this.settings.endPoints.transactions;
    this.pageService.httpSimpleGetAll(endPoint, false, {}, { subproduct: item.id, type: "add" }, ["supplier"]).then(res => {
      this.transactionsArray = res.data
      this.openModal(content, item)
    })
  }
}
