import { Component } from '@angular/core';
import { ItemsComponent } from '../../core/items.component';

@Component({
  selector: 'app-subproducts',
  templateUrl: './subproducts.component.html',
  styleUrls: ['../../core/items.component.scss']
})
export class SubproductsComponent extends ItemsComponent {
  
  suppliers: any = [];
  supplier: any
  transactionsArray: any = [];
  imei: any
  scannerEnabled: boolean = false;
  imeiEnable: boolean = false;

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
    if (!this.supplier || !this.imei) return this.pageService.showError("Complete todos los datos.")
    console.log(this.itemSelected, "item seleccionado para agregar stock")
    let item = {
      subproduct: this.itemSelected.id,
      supplier: this.supplier,
      imei: this.imei
    }
    let endPoint = this.settings.endPoints.subproducts

    this.pageService.httpPost(item, this.settings.endPointsMethods.addStock, endPoint).then(res => {
      this.getItems()
      this.pageService.showSuccess("Se cargo con exito.")
      this.imei = null
    }).catch(e => {
      this.pageService.showError("Ha ocurrido un error, intente mas tarde")
    })
  }

  deleteTransaction(item) {
    let endPoint = this.settings.endPoints.subproducts;
    let method = this.settings.endPointsMethods.substractStock + "/" + item.id;
    item.supplier = item.supplier.id
    this.pageService.httpPost(item, method, endPoint).then(res => {
      this.loadTransactions(this.itemSelected.id)
      this.getItems()
    })
  }
  loadTransactions(item, content?) {
    let endPoint = this.settings.endPoints.transactions;

    this.pageService.httpSimpleGetAll(endPoint, false, {}, { subproduct: item.id }, ["supplier"]).then(res => {
      this.transactionsArray = res.data
      if (content) this.openModal(content, item)

    })
  }


  enableScanner() {
    this.scannerEnabled = !this.scannerEnabled;
    this.imeiEnable = !this.imeiEnable;
    // if(this.scannerEnabled) {
    //   this.form.controls['code'].disable();
    // } else {
    //   this.form.controls['code'].enable();
    // }
  }

  scanSuccessHandler(event) {
    this.imei = event;
  }
}
