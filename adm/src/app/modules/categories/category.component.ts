import { Component } from '@angular/core';
import { ItemComponent } from '../../core/item.component';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['../../core/item.component.scss']
})
export class CategoryComponent extends ItemComponent {

  getFormNew() {
    return this.formBuilder.group({
      id: [null],
      name: [null, Validators.required],
    })
  }


  getFormEdit(item) {
    return this.formBuilder.group({
      id: [item.id],
      name: [item.name,Validators.required],
  
    })
  }



}
