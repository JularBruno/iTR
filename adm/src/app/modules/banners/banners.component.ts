import { Component } from '@angular/core';
import { ItemsComponent } from '../../core/items.component';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['../../core/items.component.scss']
})
export class BannersComponent extends ItemsComponent {

  name: string;
  picture: string;
  creating = false;

  handleEnable(item) {
    item.enabled = !item.enabled;

    this.pageService.httpUpdate(item)
    .then(res => this.pageService.showSuccess('El banner "' + item.name + '" ha sido ' + (item.enabled ? 'habilitado' : 'deshabilitado') + ' correctamente!'))
    .catch(e => this.pageService.showError(e));
  }

  
  openModal(content, item?) {
    if (item) {
      this.itemSelected = item;
      this.creating = false;
      this.name = this.itemSelected.name;
      this.picture = this.itemSelected.picture;
    } else {
      this.itemSelected = {};
      this.creating = true;
    }

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.clearVariables();
    }, (reason) => {
      this.closeResult = `Dismissed`;
      this.clearVariables();
    });
  }
  
  closeModal() {
    this.modalService.dismissAll();
  }

  clearVariables() {
    this.name = undefined;
    this.picture = undefined;
  }
  
  saveItemModal() {
    this.itemSelected.name = this.name;
    this.itemSelected.picture = this.picture;

    if (this.creating) {
      this.pageService.httpCreate(this.itemSelected).then(res => {
        this.pageService.showSuccess('Creado con éxito');
        this.closeModal();
        this.getItems();
      }).catch(e => this.pageService.showError(e));
    } else {
      this.update(this.itemSelected, true);
      this.closeModal();
    }
  }

  modalSaveDisabled() {
    if ( !this.name || this.name == '' || !this.picture || this.picture == '' ) return true;

    return false;
  }

  changeImage() {
    this.pageService.showImageUpload()
      .then((resp: any) => {
        this.picture = resp.data.file;
        // this.form.patchValue({ image: resp.data.file });
      })
      .catch((error: any) => { });
  }

  getFilters() {
    let _filters = {};

    return _filters;
  }

  getFiltersSearch(textSearch) {

    let filtersSearch: any = {
      "$or": [
        { "brand": { "$regex": textSearch, "$options": "i" } },
        // { "bikeModel": { "$regex": textSearch, "$options": "i" } },

      ]
    };

    return filtersSearch;
  }

}
