import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { HttpService } from './http.service';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  moduleName = '';

  constructor(
    public global: GlobalService,
    public httpService: HttpService,
    public location: Location,
    public router: Router,
    public toastr: ToastrService,
  ) {
  }


  // (+) Navigation

  navigate(endPoint = '') {
    //this.router.navigate(['/' + this.getModuleName() + endPoint]);
    this.navigateRoute('/' + this.getModuleName() + endPoint);
  }

  navigateRoute(route) {
    this.router.navigate([route]);
  }

  // (-) Navigation


  // (+) Module name

  getModuleName() {
    return this.location.path().split('/')[1];
  }

  // (-) Module name

  // (+) Http simple
  httpSimpleGetAll(endPoint, showLoading = true, sort: any = { name: 1 }, filters: any = {}, populates: any = [], page: any = -1) {
    return this.httpService.getAll(filters, sort, populates, page, endPoint);
  }
  // (-) Http simple


  // (+) Http

  getHttpEndPoint() {
    return '/' + this.getModuleName();
  }

  httpGetAll(filters, sort, populates, page,sortpopulates?, endPoint = this.getHttpEndPoint()) {    
    return this.httpService.getAll(filters, sort, populates, page, endPoint,sortpopulates );
  }

  httpRemove(item, endPoint = this.getHttpEndPoint()) {
    return this.httpService.remove(item, endPoint);
  }

  httpCreate(item, endPoint = this.getHttpEndPoint()) {
    return this.httpService.create(item, endPoint);
  }

  httpUpdate(item, endPoint = this.getHttpEndPoint()) {
    return this.httpService.update(item, endPoint);
  }

  httpGetById(id, populates, endPoint = this.getHttpEndPoint()) {
    return this.httpService.getById(id, populates, endPoint);
  }

  httpPut(values, method, endPoint = this.getHttpEndPoint()) {
    return this.httpService.put(values, method, endPoint);
  }

  httpPost(values, method, endPoint = this.getHttpEndPoint()) {
    return this.httpService.post(values, method, endPoint);
  }

  httpPatch(values, method, endPoint = this.getHttpEndPoint()) {
    return this.httpService.patch(values, method, endPoint);
  }

  httpPostFile(fileName) {
    return this.httpService.postFile(fileName);
  }

  //
  // httpDelete( endPoint ) {
  //   return this.httpService.delete( endPoint );
  // }


  // httpGet( values, method ) {
  //   return this.httpService.get( values, method, this.getModuleName() );
  // }
  //
  // httpDelete( values, method ) {
  //   return this.httpService.delete( values, method, this.getModuleName() );
  // }

  // (-) Http

  getMessage(message) {
    let msg = message;
    if (message.message) msg = message.message;
    return msg;
  }

  // (+) Show messages

  showSuccess(message) {
    this.toastr.success(this.getMessage(message));
  }

  showError(message) {
    this.toastr.error(this.getMessage(message));
  }

  // (-) Show messages

  auth(path): boolean {
    for (let routeKey in this.global.settings.routes) {
      let route = this.global.settings.routes[routeKey];
      if (path == ('/' + route.path)) {
        if (route.data && route.data.roles) {
          const user = this.global.getUser();
          if (user) {
            const userRoles = [...user.roles || []];
            if (!route.data.roles.some(r => userRoles.includes(r))) {
              return false;
            } else {
              return true;
            }
          }
        }
        return true;
      }
    }
    return true;
  }

  showImageUpload() {
    return new Promise(async (resolve, reject) => {
      let element = document.createElement('input');
      element.type = 'file';
      element.accept = '*';
      element.onchange = () => {
        this.httpPostFile(element.files[0])
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            reject(error);
          });
      };
      element.click();
    });
  }

}