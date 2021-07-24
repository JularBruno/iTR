import { Component } from '@angular/core';
import { ItemComponent } from '../../core/item.component';
import { Validators } from '@angular/forms';
import { mailFormat } from 'src/app/core/forms/validators/mailFormat';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['../../core/item.component.scss']
})
export class CustomerComponent extends ItemComponent {


  getFormNew() {
    return this.formBuilder.group({
      id: [null],
      name: [null, Validators.required],
      phone: [null, Validators.required],
      emailAddress: [null, Validators.compose([Validators.required, Validators.email, mailFormat()])],
      dni: [null, Validators.required],

    })
  }

  getFormEdit(item) {
    return this.formBuilder.group({
      id: [item.id],
      name: [item.name, Validators.required],
      phone: [item.phone, Validators.required],
      emailAddress: [item.emailAddress, Validators.compose([Validators.required, Validators.email, mailFormat()])],
      dni: [item.dni, Validators.required],

    })
  }
}
