import { Component } from '@angular/core';
import { ItemComponent } from '../../core/item.component';
import { Validators } from '@angular/forms';

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

  getFormNew() {
    return this.formBuilder.group({
      id: [null],
      name: [null, Validators.required],
    })
  }

  getFormEdit(item) {
    return this.formBuilder.group({
      id: [item.id],
      name: [item.name, Validators.required],
    })
  }

  //// COPY PASTED


  filterCategory(event) {
    console.log('event ', event)
    if(event === 'all') {
      this.categoryFilter = 'all';
    } else {
      this.categoryFilter = event;
    }
    console.log('this.categoryFilter ', this.categoryFilter)
    // this.getProducts()
  }

  filterProduct(search) {
    let filter: any = {};
    if (search == '') {
      filter = {};
    } else {
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
    }
    this.nameFilter = filter;
    // this.getProducts();
  }


  getClients() {
    this.clients = [];
    let filter = this.clientFilter;

    // this.clientsService.getAll(filter).then( res => {
    //   this.clients = res;
    // })
  }

  filterClient(search) {
    let filter: any = {};
    if (search == '') {
      filter = {};
    } else {
      filter = {
        $or: [
          {
            name: {
              $regex: search.trim(),
              $options: 'ig',
            },
          },
          {
            mail: {
              $regex: search.trim(),
              $options: 'ig',
            },
          },
        ],
      };
    }
    this.clientFilter = filter;
    // this.getClients();
  }

  selectClient(item) {
    this.clientSelected = item.id;
    console.log('this.clientSelected ', this.clientSelected);
  }

  getCategories() {
    // this.categoriesService.getAll({}).then( res => {
    //   this.categories = res;
    // })
  }

  getProducts() {
    this.products = [];
    let filter = this.nameFilter;

    if(this.categoryFilter !== 'all') {
      filter.category = this.categoryFilter;
    } else {
      delete filter.category;
    }

    // this.productsService.getAllAndPopulate(filter,['category']).then( res => {
    //   this.products = res;
    // })
  }
  
  // getFormNew() {
  //   return this.formBuilder.group({
  //     id: [null],
  //     date: [null, Validators.required],
  //     client: [null, Validators.required],
  //     total: [null, Validators.required],
  //     totalPayed: [null, Validators.required],
  //     products: [null, Validators.required],
  //   })
  // }  

  // getFormEdit(item) { ///
  //   return this.formBuilder.group({
  //     id: [item.id],
  //     date: [item.date],
  //     client: [item.client],
  //     total: [item.total],
  //     totalPayed: [item.totalPayed],
  //     products: [item.products],
  //   });
  // }

  logForm() {

    let currentDate = new Date(); 
    var datetime = `${("0" + currentDate.getDate()).slice(-2)}/${("0" + (currentDate.getMonth() + 1)).slice(-2)}/${currentDate.getFullYear()}`;

    let productIdArray = []; // product with all data
    let productIncrement = []; // array of id for stock prices change
    let isProductNoStock = false; // variable for showing error is an item is lacking of stock

    for(let i of this.productsList) {
      console.log('i ', i)
      productIdArray.push({
        product: i.product.id,
        amount: i.amount,
        price: i.price,
        total: i.total,
      });

      // if(i.product.stock === 0) {
      //   isProductNoStock = true;
      // }

      productIncrement.push({id: i.product.id, amount: i.amount * -1}); // add to array for stock prices change
    }

    let object: any = { // object to save
      date: datetime,
      client: this.clientSelected,
      total: (this.listTotal - this.discount * this.listTotal/100).toFixed(2),
      totalPayed: 0,
      products: productIdArray,
    }

    let objectIncrement = { // needed object for incrementMany
      field: 'stock',
      updateObject: productIncrement
    }

    // if(!object.client) {this.baseService.showError('Seleccione un usuario'); return;}
    // if(object.products.length === 0) {this.baseService.showError('Agregue productos a la compra'); return;}
    
    // super.logForm(object);

    console.log('this.discountStock ', this.discountStock);
    
    // this.productsService.incrementMany(objectIncrement); // change stock prices
  }

  previousProduct(item) {
    this.previousToBuy = item;
  }

  addProduct() {

    let object = {
      product: this.previousToBuy,
      amount: this.amountToBuy,
      price: this.previousToBuy.salePrice,
      total: parseFloat((this.previousToBuy.salePrice * this.amountToBuy).toFixed(2)),
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
    if (index > -1) {
      this.productsList.splice(index, 1);
    }
    this.listTotal -= item.total;
  }

}

