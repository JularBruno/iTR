import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ItemComponent } from '../../core/item.component';
import { Validators } from '@angular/forms';
import { BarcodeScannerLivestreamComponent } from "ngx-barcode-scanner";

@Component({
  selector: 'app-subproduct',
  templateUrl: './subproduct.component.html',
  styleUrls: ['../../core/item.component.scss']
})
export class SubproductComponent extends ItemComponent implements AfterViewInit {
  products: any = [];
  @ViewChild(BarcodeScannerLivestreamComponent)

  barcodeScanner: BarcodeScannerLivestreamComponent;
  barcodeValue: any
  initializePre() {
    this.loadProducts()
    // this.barcodeScanner.start();
  }
  ngAfterViewInit() {
    this.barcodeScanner.start();
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
  onValueChanges(result) {
    console.log("CHANGES ON VALUE", result)
    console.log(result.codeResult.code);
  }
  onStarted(started) {
    console.log(started, "STARTED");
  }
  scan() {
    this.barcodeScanner.start();
    console.log("Starting scanner")

  }
}
