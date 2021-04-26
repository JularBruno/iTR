import { Component } from '@angular/core';
import { ItemComponent } from '../../core/item.component';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['../../core/item.component.scss']
})
export class OrderComponent extends ItemComponent {

  orderItems: any;
  
  initializePre() {
    
  }

  getOrderItems(order) {
    // let endPoint = this.settings.endPoints.orderItems;

    // this.pageService.httpSimpleGetAll(endPoint, true, {}, { order })
    // .then(res => this.orderItems = res.data)
    // .catch(e => this.pageService.showError(e));
  }
  

  itemLoaded(item) {
    this.getOrderItems(item.id);
    console.log(item)
  }
}
