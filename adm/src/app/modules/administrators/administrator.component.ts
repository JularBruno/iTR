import { Component } from '@angular/core';
import { ItemComponent } from '../../core/item.component';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['../../core/item.component.scss']
})
export class AdministratorComponent extends ItemComponent {


  getFormNew() {
    return this.formBuilder.group({
      id: [null],
      username: [null, Validators.required],
      type: [null, Validators.required],
      password: [null, Validators.required],
      passwordVerify: [null, Validators.required]
    });
  }

  getFormEdit(item) {
    return this.formBuilder.group({
      id: [item.id],
      username: [item.username],
      type: [item.type, Validators.required]
    });
  }

  changePassword() {
    this.pageService.navigate('/' + this.item.id + '/changePassword');
  }


  savePre(item) {
    console.log(item)
  }

  savePreCheck( item ) {
    if(item.password != item.passwordVerify) {
      this.pageService.showError('Las contraseñas deben coincidir');
      return false;
    }
    return true;
  }

}
