import { Component } from '@angular/core';
import { ItemComponent } from '../../core/item.component';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['../../core/item.component.scss']
})
export class BannerComponent extends ItemComponent {

  brands:any = [];
  brandsModel:any = [];

  getFormNew() { 
    return this.formBuilder.group({
      id: [null],
      brand: [null, Validators.required],
      brandModel: [null, Validators.required],
      year: [null, Validators.required],
    })
  }

  getFormEdit(item) {
    return this.formBuilder.group({
      id: [item.id],
      brand: [item.brand, Validators.required],
      brandModel: [item.brandModel, Validators.required],
      year: [item.year, Validators.required],
    })
  }



  getBrands() {
    // this.pageService.httpSimpleGetAll(this.pageService.global.settings.endPoints.brands)
    // .then((resp) => this.brands = resp.data)
    // .catch((error) => console.log(error))
  }

  getBrandsModels() {
    // this.pageService.httpSimpleGetAll(this.pageService.global.settings.endPoints.brandModels,true,{},{brand:this.form.value.brand},['brand'])
    // .then((resp) => {
    //   this.brandsModel = resp.data
    // })
    // .catch((error) => console.log(error))
  }

  // initializePre() {
  //   this.getBrands();
  //   this.formValueChanges();
  // }

  // itemLoaded(item) { 
  //   this.formValueChanges();
  //   this.getBrandsModels();
  // }

  // formValueChanges() {
  //   this.form.get("brand").valueChanges.subscribe(selectedValue => {
  //     this.form.patchValue({brandModel: null});
  //     this.brandsModel = [];
  //     this.getBrandsModels();
  //   });
  // }



}
