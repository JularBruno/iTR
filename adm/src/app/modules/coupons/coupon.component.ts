import { Component } from '@angular/core';
import { ItemComponent } from '../../core/item.component';
import { Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['../../core/item.component.scss']
})
export class CouponComponent extends ItemComponent {

  companies: any;
  products: any;
  categories: any;
  options: any;
  additionals: any;
  dueDate: any = "";
  category = "";
  type = "";
  discount = 0;
  priceWithDiscount: any = 0;
  priceWithoutDiscount = 0;
  minDate = (moment().add(1, 'days')).format('yyyy-MM-DD');
  invalidDiscountValueAlert: string;
  modalProducts: any;
  modalProduct: any;
  modalOption = '';
  modalOptionPrice = '';

  initializePre() {
    this.getCompanies();
    this.getProducts();
    this.getCategories();
  }

  deleteAdditional(additional) {
    let index = this.additionals.indexOf(additional);
    if (index > -1) {
      this.additionals.splice(index, 1);
      this.modalProducts.push(additional);
    }
  }

  deleteOption(option) {
    let index = this.options.indexOf(option);
    this.options.splice(index, 1);
  }

  checkModalProducts() {
    this.modalProducts.forEach(modalProduct => {
      this.additionals.forEach(additional => {
        if (modalProduct.id === additional.id) {
          const index = this.modalProducts.indexOf(modalProduct);
          if (index > -1) {
            this.modalProducts.splice(index, 1);
            this.checkModalProducts();
            return;
          }
        }
      });
    });
  }

  openModal(content, item) {
    this.itemSelected = item || '';
    if (this.type === this.settings.products.type.product.code) this.checkModalProducts();

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  saveItemModal() {
    if (this.type === this.settings.products.type.product.code) {
      let selectedProduct = this.products.find(p => p.id === this.modalProduct);
      this.additionals.push(selectedProduct);
      this.checkModalProducts();
    } else {
      let newOption = {
        name: this.modalOption,
        price: this.modalOptionPrice
      };
      this.options.push(newOption);
    }
    this.clearVariables();
    this.closeModal();
  }

  modalSaveDisabled() {
    if (this.type === this.settings.products.type.product.code) {
      return this.modalProduct ? false : true;
    }

    if (this.modalOption !== '' && this.modalOptionPrice !== '') return false;
    return true;
  }

  clearVariables() {
    this.modalProduct = undefined;
    this.modalOption = '';
    this.modalOptionPrice = '';
  }

  handleProductChange(product) {
    let selectedProduct = this.products.find(p => p.id === product.value);
    this.priceWithoutDiscount = selectedProduct.price;
    this.category = selectedProduct.category;
    this.type = selectedProduct.type;
    this.calculatePriceWithDiscount();
  }

  calculatePriceWithDiscount() {
    if (this.discount > 100) {
      this.priceWithDiscount = 0;
      this.invalidDiscountValueAlert = 'El descuento no puede ser de más del 100%';
    } else if (this.discount < 0) {
      this.priceWithDiscount = 0;
      this.invalidDiscountValueAlert = 'El descuento no puede ser menor a 0%';
    } else {
      this.invalidDiscountValueAlert = undefined;
      this.priceWithDiscount =  this.priceWithoutDiscount - (this.priceWithoutDiscount / 100 * this.discount);
      this.priceWithDiscount = this.priceWithDiscount.toFixed(2);
    }
  }
  
  itemLoaded(item) {
    this.loading = false;
  }

  savePre(item) {
    let additionals = [];
    item.additionals.forEach(e => additionals.push(e.id));
    item.additionals = additionals;
    item.dueDate = moment(this.dueDate);
    item.price = this.priceWithDiscount;
    item.discount = this.discount;
    item.category = this.category;
    item.type = this.type;

    // item.options


    console.log(item)
  }

  getCategories() {
    let endPoint = this.settings.endPoints.categories;

    this.pageService.httpSimpleGetAll(endPoint)
    .then(res => this.categories = res.data)
    .catch(e => this.pageService.showError(e));
  }

  getProducts() {
    let endPoint = this.settings.endPoints.products;

    this.pageService.httpSimpleGetAll(endPoint)
    .then(res => {
      this.products = res.data;
      this.modalProducts = this.products.filter(p => p.type === this.settings.products.type.product.code);
    }).catch(e => this.pageService.showError(e));
  }
  
  getCompanies() {
    let endPoint = this.settings.endPoints.companies;

    this.pageService.httpSimpleGetAll(endPoint)
    .then(res => this.companies = res.data)
    .catch(e => this.pageService.showError(e));
  }

  getFormNew() {
    return this.formBuilder.group({
      id: [null],
      company: [null, Validators.required],
      product: [null, Validators.required],
      description: [null],
      price: [null, Validators.required],
      discount: [null, Validators.required],
      dueDate: [null, Validators.required],
      quantityAvailable: [null, Validators.required],
      type: [null, Validators.required],
      conditions: [null],
      options: [null],
      additionals: [null],
      category: [null, Validators.required],
      name: [null, Validators.required],
    })
  }


  getFormEdit(item) {
    this.dueDate = moment(item.dueDate).format("yyyy-MM-DD");
    this.options = item.options;
    this.additionals = item.additionals;
    let selectedProduct = this.products.find(p => p.id === item.product);
    this.type = selectedProduct.type;
    this.priceWithoutDiscount = selectedProduct.price;
    this.category = selectedProduct.category;
    this.priceWithDiscount = item.price;
    this.discount = item.discount;
    this.calculatePriceWithDiscount();

    return this.formBuilder.group({
      id: [item.id],
      company: [item.company, Validators.required],
      product: [item.product, Validators.required],
      description: [item.description],
      price: [item.price, Validators.required],
      discount: [item.discount, Validators.required],
      dueDate: [item.dueDate, Validators.required],
      quantityAvailable: [item.quantityAvailable, Validators.required],
      type: [item.type, Validators.required],
      conditions: [item.conditions],
      options: [item.options],
      additionals: [item.additionals],
      name: [item.name, Validators.required],
      category: [item.category, Validators.required],
    })
  }

  getPopulates() {
    return ['additionals'];
  }
}
