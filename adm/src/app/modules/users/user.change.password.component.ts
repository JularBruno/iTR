import { Component } from '@angular/core';
import { ItemComponent } from '../../core/item.component';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-user-change-password',
  templateUrl: './user.change.password.component.html',
  styleUrls: ['../../core/item.component.scss']
})
export class UserChangePasswordComponent extends ItemComponent {

  getServiceName() {
    return 'users';
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
