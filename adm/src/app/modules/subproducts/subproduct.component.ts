import { AfterViewInit, Component } from '@angular/core';
import { ItemComponent } from '../../core/item.component';
import { Validators } from '@angular/forms';
// import { ZXingScannerComponent } from '@zxing/ngx-scanner';

@Component({
  selector: 'app-subproduct',
  templateUrl: './subproduct.component.html',
  styleUrls: ['./subproduct.component.scss' ,'../../core/item.component.scss']
})
export class SubproductComponent extends ItemComponent implements AfterViewInit {
  products: any = [];

  product: any;

  scannerEnabled: boolean = false;

  categoryFilter: any;
  nameFilter: any = {};
  search: any;

  initializePre() {
    // this.loadProducts()
    this.getProducts()
  }

  ngAfterViewInit() {
  }

  setProduct(item) {
    this.product = item;
    this.form.patchValue({product: this.product.id});
  }

  filterProduct(search) {

    let filter: any = {};
    if (search == '') {
      this.nameFilter = filter;
      this.getProducts();
      return
    }
    filter = {
      $or: [
        {
          name: {
            $regex: ".*"+search.trim()+".*",
            $options: 'ig',
          },
        },
        {
          code: {
            $regex: search.trim(),
            $options: 'ig',
          },
        },
      ],
    };
    this.nameFilter = filter;
    console.log(this.nameFilter, "filter on search")
    this.getProducts();
  }


  getProducts() {
    this.products = [];
    let endPoint = this.settings.endPoints.products
    let filter: any = {}
    if (this.nameFilter) {
      filter = this.nameFilter
    }
    if (this.categoryFilter !== 'all') {
      filter.product = this.categoryFilter;
    } else {
      delete filter.product;
    }
    this.pageService.httpSimpleGetAll(endPoint, false, {}, filter, ["product"]).then(res => {
      console.log("subproducts", res.data)
      this.products = res.data;
    })
  }


  getFormNew() {
    return this.formBuilder.group({
      id: [null],
      name: [null, Validators.required],
      code: [0, Validators.required],
      price: [null, Validators.required],
      product: [null, Validators.required],
      cost: [null, Validators.required],
    })
  }

  getFormEdit(item) {
    this.product = item.product;
    this.getProducts()
    
    return this.formBuilder.group({
      id: [item.id],
      name: [item.name, Validators.required],
      code: [item.code, Validators.required],
      price: [item.price, Validators.required],
      cost: [item.cost, Validators.required],
      product: [item.product, Validators.required],
    })
  }

  onValueChanges(result) {
    console.log(result.codeResult.code);
  }

  onStarted(started) {
    console.log(started, "STARTED");
  }

  enableScanner() {
    this.scannerEnabled = !this.scannerEnabled;
    if (this.scannerEnabled) {
      this.form.controls['code'].disable();
    } else {
      this.form.controls['code'].enable();
    }
  }

  scanSuccessHandler(event) {
    this.form.value.code = event;
  }
}
