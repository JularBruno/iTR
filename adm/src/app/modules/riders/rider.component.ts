import { Component } from '@angular/core';
import { ItemComponent } from '../../core/item.component';
import { Validators } from '@angular/forms';
import { mailFormat } from '../../core/forms/validators/mailFormat';
import * as moment from 'moment';

@Component({
  selector: 'app-rider',
  templateUrl: './rider.component.html',
  styleUrls: ['../../core/item.component.scss']
})
export class RiderComponent extends ItemComponent {

  endPoint = this.settings.endPoints.users;
  image:any = "";
  birthDay = '';


  getFormNew(){
    return this.formBuilder.group({
      id: [null],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      birthDay: [null],
      phoneNumber: [null, Validators.required],
      emailAddress: [null, Validators.compose([Validators.required, Validators.email, mailFormat()])],
      driverLicense: [null, Validators.required],
      ruat: [null, Validators.required],
      picture: [null],
      plateNumber: [null, Validators.required],
      licenseNumber: [null, Validators.required],
      // riderAddress: [null, Validators.required],
    })
  }

  getFormEdit(item){
    if (item.birthDay) this.birthDay = moment(item.birthDay).format("yyyy-MM-DD");
    return this.formBuilder.group({
      id: [item.id],
      birthDay: [item.birthDay],
      driverLicense: [item.driverLicense, Validators.required],
      ruat: [item.ruat, Validators.required],
      plateNumber: [item.plateNumber, Validators.required],
      licenseNumber: [item.licenseNumber, Validators.required],
      // riderAddress: [item.riderAddress, Validators.required],
      firstName: [item.firstName, Validators.required],
      lastName: [item.lastName, Validators.required],
      phoneNumber: [item.phoneNumber, Validators.required],
      emailAddress: [item.emailAddress, Validators.compose([Validators.required, Validators.email, mailFormat()])],
      picture: [item.picture],
    })
  }

  savePre(item) {
    item.username = item.emailAddress;
    item.birthDay = this.birthDay;
  }

  savePreCheck( item ) {

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


  onSubmitPerform(item) {
    this.savePre(item);

    if( !this.savePreCheck( item ))return;
    
    if (!item.id) {
      delete (item.id);
      this.pageService.httpCreate(item, this.endPoint)
        .then((response) => {
          this.pageService.showSuccess('Se ha guardado exitosamente!!');
          this.savePost(response);
          this.pageService.navigate();
        })
        .catch((reason) => {
          this.pageService.showError(reason);
          this.savePostError(reason);
        });
    } else {
      this.pageService.httpUpdate(item, this.endPoint)
        .then((response) => {
          this.pageService.showSuccess('Se ha actualizado exitosamente!!');
          this.savePost(response);
          this.pageService.navigate();
        })
        .catch((reason) => {
          this.pageService.showError(reason);
          this.savePostError(reason);
        });
    }
  }
}
