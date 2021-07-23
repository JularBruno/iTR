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
  @ViewChild('pdfTable') pdfTable: ElementRef;

  payARS() {
    let update = {
      $inc: { paidARS: this.paidARS },
      id: this.itemSelected.id
    }
    this.pageService.httpUpdate(update, this.settings.endPoints.sales).then(async res => {
      let item = await this.pageService.httpGetById(this.itemSelected.id, ["client"])
      this.itemSelected = item.data
    })
  }
  payUSD() {
    let update = {
      $inc: { paidUSD: this.paidUSD },
      id: this.itemSelected.id
    }
    this.pageService.httpUpdate(update, this.settings.endPoints.sales).then(async res => {
      let item = await this.pageService.httpGetById(this.itemSelected.id, ["client"])
      this.itemSelected = item.data
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
    if(this.scannerEnabled) {
      // this.form.controls['code'].disable();
    } else {
      // this.form.controls['code'].enable();
    }
  }
 
  scanSuccessHandler(event) {
    // this.form.value.code = event;
  }

  getTop(i) {
    return 323 + i*26;
  }

  getTopHr(i) {
    return 334 + i*37;
  }


}
