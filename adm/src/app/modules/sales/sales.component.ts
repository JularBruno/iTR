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
  product: any;
  name: any;
  stock: any;
  priceSub: any;
  subproducts: any = [];
  code: any
  @ViewChild('pdfTable') pdfTable: ElementRef;
  disableCode = false;
  dolarPrice = 0;

  user: any = this.global.getUser()
  dateFrom: any;
  dateTo: any;
  totalSale: any = 0;
  customers: any = [];
  customer: any = ""
  
  preOpenModal() {
    this.getProducts();
    this.getSaleSubProducts();
    this.getDolarPrice();
  }
  getItemSuccess() {
    this.getTotalSales()
  }
  initialize() {
    this.getCustomers()

  }

  getCustomers() {
    this.pageService.httpSimpleGetAll(this.global.settings.endPoints.customers).then(res => {
      this.customers = res.data;
    })
  }
  getTotalSales() {
    let endpoint = this.global.settings.endPoints.sales + this.global.settings.endPointsMethods.totalSales
    this.pageService.httpSimpleGetAll(endpoint, false, {}, this.getFilters(), this.getPopulates()).then(res => {
      this.totalSale = res.data.totalSales
    })
  }
  sort() {
    return { createdAt: -1 }
  }
  getSaleSubProducts() {
    this.pageService.httpSimpleGetAll(this.global.settings.endPoints.subproducts, false, {}, { isFromSale: true, sale: this.itemSelected.id }).then(res => {
      this.subproducts = res.data
    })
  }

  getProducts() {
    this.pageService.httpSimpleGetAll(this.global.settings.endPoints.products).then(res => {
      this.products = res.data;
    })
  }

  getDolarPrice() {
    this.pageService.httpSimpleGetAll(this.global.settings.endPoints.dolar).then(res => {
      this.dolarPrice = res.data[0].value;
    })
  }

  payARS() {
    let update = {
      $inc: { paidARS: this.paidARS },
      id: this.itemSelected.id
    }
    this.pageService.httpUpdate(update, this.settings.endPoints.sales).then(async res => {
      // await this.getItemSelected()
      let incrementD = this.paidARS / this.dolarPrice;

      let updateTotal = {
        $inc: { paidTOTAL: incrementD.toFixed(2) },
        id: this.itemSelected.id
      }

      this.pageService.httpUpdate(updateTotal, this.settings.endPoints.sales).then(async res => {
        this.getItems();
        await this.getItemSelected()
      })
    })

  }

  payUSD() {
    let update = {
      $inc: { paidUSD: this.paidUSD },
      id: this.itemSelected.id
    }
    this.pageService.httpUpdate(update, this.settings.endPoints.sales).then(async res => {
      // await this.getItemSelected()
      let updateTotal = {
        $inc: { paidTOTAL: this.paidUSD },
        id: this.itemSelected.id
      }

      this.pageService.httpUpdate(updateTotal, this.settings.endPoints.sales).then(async res => {
        this.getItems();
        await this.getItemSelected()
      })
    })

  }

  async getItemSelected() {
    let item = await this.pageService.httpGetById(this.itemSelected.id, ["client"])
    console.log('this.itemSelected ', this.itemSelected);
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
      let sale = {
        id: this.itemSelected.id,
        $inc: { paidPROD: subproduct.price * subproduct.stock }
      }

      this.pageService.httpUpdate(sale).then(res => {
        this.getItemSelected()
        this.preOpenModal()
        this.name = this.code = this.product = this.stock = this.price = undefined

        let updateTotal = {
          $inc: { paidTOTAL: subproduct.price * subproduct.stock },
          id: this.itemSelected.id
        }

        this.pageService.httpUpdate(updateTotal, this.settings.endPoints.sales).then(async res => {
          await this.getItemSelected()
        })

      })
      this.pageService.showSuccess("Se ha agregado el producto a la venta exitosamente")

    })
  }

  displayProductLoad() {
    this.showProductInterface = true
  }
  filterClient(customer) {
    this.customer = customer
  }
  getFilters() {
    let createdAt: any = {};
    // let user = this.global.getuser()
    let _filters = {};
    if ((this.dateFrom || this.dateTo) && !this.user.roles.includes("manager")) {
      const start = moment(this.dateFrom).startOf('day').toDate()
      const end = moment(this.dateTo).endOf('day').toDate()
      createdAt["$gte"] = start;
      createdAt["$lte"] = end;
      _filters['createdAt'] = createdAt;
    } else if (this.user.roles.includes("manager")) {
      const start = moment().startOf('day').toDate()
      const end = moment().endOf('day').toDate()
      createdAt["$gte"] = start;
      createdAt["$lte"] = end;
      _filters['createdAt'] = createdAt;
    }
    if (this.price) {
      _filters["total"] = this.price
    }
    if (this.customer != "") {
      _filters["client"] = this.customer
    }

    console.log(_filters, "filter")
    return _filters;
  }

  getPopulates() {
    return ["client"]
  }

  // getFiltersSearch(textSearch) {
  //   let filtersSearch: any = {
  //     "$or": [
  //       { "client.name": { "$regex": textSearch, "$options": "i" } },
  //     ]
  //   };
  //   return filtersSearch;
  // }


  enableScanner() {
    this.scannerEnabled = !this.scannerEnabled;
    this.disableCode = !this.disableCode;
  }

  scanSuccessHandler(event) {
    console.log(event, "event scanner")
    this.code = event;
  }

  getTop(i) {
    return 323 + i * 26;
  }

  getTopHr(i) {
    return 334 + i * 37;
  }

  restartPrice(type) {

    if (type == 'pesos') {

      let incrementD = (this.itemSelected.paidTOTAL - this.itemSelected.paidUSD - this.itemSelected.paidPROD) * -1;

      let updateTotal = {
        $inc: { paidTOTAL: incrementD.toFixed(2) },
        id: this.itemSelected.id
      }

      this.pageService.httpUpdate(updateTotal, this.settings.endPoints.sales).then(async res => {
        await this.getItemSelected()
        let update = {
          // $inc: { paidARS: 0 },
          paidARS: 0,
          id: this.itemSelected.id
        }
        this.pageService.httpUpdate(update, this.settings.endPoints.sales).then(async res => {
          this.getItems();
          await this.getItemSelected()
        })
      })


    } else {

      let updateTotal = {
        $inc: { paidTOTAL: - this.itemSelected.paidUSD },
        id: this.itemSelected.id
      }

      this.pageService.httpUpdate(updateTotal, this.settings.endPoints.sales).then(async res => {
        // await this.getItemSelected()
        let update = {
          // $inc: { paidUSD: 0 },
          paidUSD: 0,
          id: this.itemSelected.id
        }
        this.pageService.httpUpdate(update, this.settings.endPoints.sales).then(async res => {
          this.getItems();
          await this.getItemSelected()
        })
      })
    }

  }

}
