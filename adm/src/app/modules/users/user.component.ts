import { Component, OnInit } from '@angular/core';
import { ItemComponent } from '../../core/item.component';
import { Validators } from '@angular/forms';
import { dniFormat } from '../../core/forms/validators/dniFormat';
import { usernameFormat } from '../../core/forms/validators/usernameFormat';
import { mailFormat } from '../../core/forms/validators/mailFormat';
import * as moment from 'moment';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['../../core/item.component.scss']
})

export class UserComponent extends ItemComponent {

  image:any = "";


  getFormNew(){
    return this.formBuilder.group({
      id: [null],
      password: [null, Validators.required],
      passwordVerify: [null, Validators.required],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      phoneNumber: [null, Validators.required],
      emailAddress: [null, Validators.compose([Validators.required, Validators.email, mailFormat()])],
      gender: [null, Validators.required],
      picture: [null],

    })
  }

  getFormEdit(item){
    return this.formBuilder.group({
      id: [item.id],
      password: [item.password, Validators.required],
      firstName: [item.firstName, Validators.required],
      lastName: [item.lastName, Validators.required],
      phoneNumber: [item.phoneNumber, Validators.required],
      emailAddress: [item.emailAddress, Validators.compose([Validators.required, Validators.email, mailFormat()])],
      gender: [item.gender, Validators.required],
      picture: [item.picture],
    })
  }

  savePre(item) {
    item.username = item.emailAddress
  }

  savePreCheck( item ) {

    if(this.creating) {
      if(item.password != item.passwordVerify) {
        this.pageService.showError('La contaseña y la confirmacion deben coincidir!!!');
        return false;
      }
    }

    return true;
  }

  changeImage() {
    this.pageService.showImageUpload()
      .then((resp: any) => {
        this.image = resp.data.file;
        this.form.patchValue({ picture: resp.data.file });
      })
      .catch((error: any) => { });
  }


  changePassword() {
    this.pageService.navigate('/' + this.item.id + '/changePassword');
  }



}
