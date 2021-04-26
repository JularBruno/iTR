import { Component } from '@angular/core';
import { ItemComponent } from '../../core/item.component';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-administrator-change-password',
  templateUrl: './administrator.change.password.component.html',
  styleUrls: ['./administrators.component.scss'],
})
export class AdministratorChangePasswordComponent extends ItemComponent {

  getServiceName() {
    return 'administrators';
  }

  getFormEdit( item ) {
    return this.formBuilder.group({
      id: [item.id],
      password: [null, Validators.required],
      passwordNew: [null, Validators.required],
      passwordNewVerify: [null, Validators.required]
    })
  }

  save() {
    this.pageService.httpPut( this.form.value, '/' + this.item.id + '/changePassword' )
    .then( (response) => {
        this.pageService.showSuccess('Se ha actualizado exitosamente!!');
        this.pageService.navigate();
    })
    .catch((reason) => {
      this.pageService.showError(reason);
    });
  }

}
