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
  amountToBuy: number = 1;
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
      // id: [null],
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


  getClients() {
    this.clients = [];
    let filter = this.clientFilter;
    let endpoint = this.settings.endPoints.customers
    this.pageService.httpSimpleGetAll(endpoint, false, {}, filter, []).then(res => {
      this.clients = res.data
    })
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
    console.log('item ', item);
    this.clientSelected = item.id;
  }

  onSubmitPerform(item) {
    let endpoint = this.settings.endPoints.customers

    this.pageService.httpPost(item, "", endpoint).then(res => {
      console.log(res, "cliente creado");
      this.pageService.showSuccess('Cliente creado!');
      this.form.reset();
      this.getClients()
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
      console.log(res, "products")
      this.products = res.data;
    })
  }

  logForm() {


    // let productIdArray = []; // product with all data
    // let productIncrement = []; // array of id for stock prices change
    // console.log(this.productsList, "lista de productos")
    // for (let i of this.productsList) {
    //   console.log('i ', i)
    //   productIdArray.push({
    //     product: i.product.id,
    //     amount: i.amount,
    //     price: i.price,
    //     total: i.total,
    //   });

    //   productIncrement.push({ id: i.product.id, amount: i.amount * -1 }); // add to array for stock prices change
    // }
    console.log('this.clientSelected ', this.clientSelected);
    
    if (!this.clientSelected) return this.pageService.showError("Seleccione un cliente")
    if (this.productsList.length == 0) return this.pageService.showError("Seleccione al menos un producto")
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

    console.log(object, "objeto a guardar")
    let method = this.settings.endPointsMethods.createSale
    this.pageService.httpPost(object, method).then(response => {
      console.log(response)
      this.pageService.navigate()
    })
    // this.productsService.incrementMany(objectIncrement); // change stock prices
  }

  previousProduct(item) {
    this.previousToBuy = item;
  }

  addProduct() {
    let object = {
      product: this.previousToBuy,
      amount: this.amountToBuy,
      price: this.previousToBuy.price,
      total: parseFloat((this.previousToBuy.price * this.amountToBuy).toFixed(2)),
    }

    this.productsList.push(object);
    this.previousToBuy = {
      name: '',
      salePrice: 0,
    };;
    this.amountToBuy = 1;
    this.listTotal += object.total;
  }

  deleteListItem(item) {
    const index = this.productsList.indexOf(item);
    if (index != -1) {
      this.productsList.splice(index, 1);
    }
    this.listTotal -= item.total;
  }

}

