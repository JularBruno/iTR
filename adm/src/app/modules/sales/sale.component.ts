import { Component } from '@angular/core';
import { ItemComponent } from '../../core/item.component';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PageService } from 'src/app/core/page.service';
import { mailFormat } from 'src/app/core/forms/validators/mailFormat';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})
export class SaleComponent extends ItemComponent {

  //// COPY PASTED

  clients: any = [];
  products: any = [];
  categories: any = [];
  //// product filter
  categoryFilter: any;
  nameFilter: any = {};
  //// client filter
  clientFilter: any = {};
  //// previous product list
  previousToBuy: any = {
    name: '',
    salePrice: 0,
  };
  amountToBuy: number = 0;
  productsList: any = [];
  //// client
  clientSelected: string;
  userFilter: any = {};
  // close 
  discount: number = 0;
  listTotal: number = 0;
  discountStock: boolean = false;
  ///
  search: any;
  searchU: any;
  loading: any;
  transactions: any = [];
  imeiFilter: any;
  categorySelected: any;

  //// FIN COPY PASTED
  constructor(
    public formBuilder: FormBuilder,
    public activatedRoute: ActivatedRoute,
    public pageService: PageService,
    public modalService: NgbModal
  ) {
    super(formBuilder, activatedRoute, pageService, modalService)
  }

  ngOnInit() {
    this.getCategories()
    this.getClients()
    this.getProducts()
  }

  getFormNew() {
    return this.formBuilder.group({
      name: [null, Validators.required],
      phone: [null, Validators.required],
      emailAddress: [null, Validators.compose([Validators.required, mailFormat()])],
      dni: [null, Validators.required]
    })
  }


  //// COPY PASTED


  filterCategory(event) {
    this.categoryFilter = event
    this.getProducts()
  }
  filterImei(event) {
    this.imeiFilter = event
    this.getTransactions(this.categorySelected)
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
            $regex: search.trim(),
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
    this.getProducts();
  }


  async getClients() {
    this.clients = [];
    let filter = this.clientFilter;
    let endpoint = this.settings.endPoints.customers
    let clients = await this.pageService.httpSimpleGetAll(endpoint, false, {}, filter, [])
    this.clients = clients.data
  }

  filterClient(search) {
    let filter: any = {};
    if (search == '') {
      this.clientFilter = {};
      this.getClients()
      return
    }
    filter = {
      $or: [
        {
          name: {
            $regex: search.trim(),
            $options: 'ig',
          },
        },
        {
          emailAddress: {
            $regex: search.trim(),
            $options: 'ig',
          },
        },
      ],
    };

    this.clientFilter = filter;
    this.getClients();
  }

  selectClient(item) {
    this.clientSelected = item.id;
  }
  selectProduct(item) {
    this.categorySelected = item;
    this.getTransactions(item)
  }
  onSubmitPerform(item) {
    let endpoint = this.settings.endPoints.customers

    this.pageService.httpPost(item, "", endpoint).then(async res => {
      this.pageService.showSuccess('Cliente creado!');
      this.form.reset();
      await this.getClients()
      this.selectClient(res.data)
    })
  }

  getCategories(filter?) {
    let endPoint = this.settings.endPoints.products
    this.pageService.httpSimpleGetAll(endPoint, false, {}, filter, []).then(res => {
      this.categories = res.data;
    })
  }

  getProducts() {
    this.products = [];
    let endPoint = this.settings.endPoints.subproducts
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
      this.products = res.data;
    })
  }

  logForm() {

    console.log('this.clientSelected ', this.clientSelected);

    if (!this.clientSelected) return this.pageService.showError("Seleccione un cliente")
    if (this.productsList.length == 0) return this.pageService.showError("Seleccione al menos un imei")
    if (this.listTotal - this.discount < 0) return this.pageService.showError("El el total no puede ser menor a 0")
    let currentDate = new Date();
    var datetime = `${("0" + currentDate.getDate()).slice(-2)}/${("0" + (currentDate.getMonth() + 1)).slice(-2)}/${currentDate.getFullYear()}`;
    let object: any = { // object to save
      date: datetime,
      client: this.clientSelected,
      total: this.listTotal.toFixed(2),
      discount: this.discount,
      products: this.productsList,
    }

    let method = this.settings.endPointsMethods.createSale
    this.pageService.httpPost(object, method).then(response => {
      this.pageService.navigate()
    })
    // this.productsService.incrementMany(objectIncrement); // change stock prices
  }
  existsImei(item) {
    if (this.productsList.some(a => a.id == item.id)) return true
    else return false
  }

  getTransactions(item) {
    let filter: any = { subproduct: item.id, sold: false }
    if (this.imeiFilter) {
      filter.imei = {
        $regex: this.imeiFilter.trim(),
        $options: 'ig',
      }
    }
    let endPoint = this.settings.endPoints.transactions;
    this.pageService.httpSimpleGetAll(endPoint, false, {}, filter, ["supplier", "subproduct"]).then(res => {
      if (res.data.length == 0) this.pageService.showError("Este subproducto no tiene imeis para mostrar")
      this.transactions = res.data
    })
  }
  addToSale(item) {
    delete item.sold
    this.productsList.push(item)
    this.listTotal += item.subproduct.price
    this.amountToBuy += 1;
    console.log(this.productsList)
    console.log(this.listTotal)
  }

  deleteListItem(item) {
    const index = this.productsList.indexOf(item);
    if (index != -1) {
      this.productsList.splice(index, 1);
    }
    // this.listTotal -= item.total;
  }

}

