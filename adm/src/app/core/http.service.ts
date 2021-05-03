import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  serviceName = "";

  constructor(
    public http: HttpClient,
    public global: GlobalService
  ) {
    this.initialize();
  }

  initialize() {
    this.buildServiceName();
  }

  buildServiceName() {
    this.serviceName = this.constructor.name.replace("Service", "").toLowerCase();
  }


  // (+) Items

  getAll(filters, sort, populates, page, endPoint = '/' + this.getServiceName(), sortpopulates?) {
    let action = '/?_filters=' + encodeURI(JSON.stringify(filters))
      + '&_sort=' + encodeURI(JSON.stringify(sort))
      + '&_populates=' + encodeURI(JSON.stringify(populates))
      + '&_page=' + encodeURI(page);

    if (sortpopulates) {
      action = action + '&_sortPopulates=' + encodeURI(JSON.stringify(sortpopulates));
    }
    return this.get(action, endPoint);
  }


  getById(id, populates, endPoint = '/' + this.serviceName) {
    const action = '/?_populates=' + encodeURI(JSON.stringify(populates))
    return this.get('/' + id + action, endPoint);
  }

  create(value, endPoint = '/' + this.getServiceName()) {
    return this.post(value, '', endPoint);
  }

  update(value, endPoint = '/' + this.getServiceName()) {
    return this.put(value, '/' + value.id, endPoint);
  }

  remove(value, endPoint = '/' + this.getServiceName()) {
    return this.delete('/' + value.id, endPoint);
  }

  // (-) Items



  // (+) Basic

  delete(action, endPoint = '/' + this.getServiceName()) {
    const url = environment.serverUrl + endPoint + action;
    return this.http.delete(url, this.getHeaders())
      .toPromise()
      .then((response: any) =>
        response
      )
      .catch(this.handleError.bind(this));
  }

  put(value, action, endPoint = '/' + this.getServiceName()) {
    const url = environment.serverUrl + endPoint + action;
    return this.http.put(url, value, this.getHeaders())
      .toPromise()
      .then((response: any) =>
        response
      )
      .catch(this.handleError.bind(this));
  }

  post(value, action, endPoint = '/' + this.getServiceName()) {
    const url = environment.serverUrl + endPoint + action;
    return this.http.post(url, value, this.getHeaders())
      .toPromise()
      .then((response: any) =>
        response
      )
      .catch(this.handleError.bind(this));
  }

  patch(value, action, endPoint = '/' + this.getServiceName()) {
    const url = environment.serverUrl + endPoint + action;
    return this.http.patch(url, value, this.getHeaders())
      .toPromise()
      .then((response: any) =>
        response
      )
      .catch(this.handleError.bind(this));
  }

  get(action, endPoint = '/' + this.getServiceName()) {
    const url = environment.serverUrl + endPoint + action;
    return this.http.get(url, this.getHeaders())
      .toPromise()
      .then((response: any) =>
        response
      )
      .catch(this.handleError.bind(this));
  }

  // (-) Basic

  postFile(file) {
    const url = environment.serverUrl + this.global.settings.endPoints.files + '/upload';
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post(url, fd)
      .toPromise()
      .then((response: any) => {
        return response;
      })
      .catch(this.handleError);
  }


  createFile(file) {

    const url = environment.serverUrl + this.global.settings.endPoints.files + '/upload'

    const fd = new FormData();
    fd.append('file', file);

    return this.http.post(url, fd)
      .toPromise()
      .then((response: any) =>
        response
      )
      .catch(this.handleError);
  }

  getHeaders() {
    if (this.global.getUser()) {
      return {
        headers: new HttpHeaders({
          'x-access-token': this.global.getUser().token
        })
      };
    } else {
      return {};
    }
  }

  // deleteFiles(arr) {
  //   const url = environment.serverUrl + this.global.settings.endPoints.files + '/delete';
  //   const headers: any = {}
  //   const options = new RequestOptions({
  //     headers: headers,
  //     body: arr
  //   })
  //   return this.http.delete(url, options)
  //     .toPromise()
  //     .then(response => response)
  //     .catch(err => this.handleError.bind(err));
  // }


  handleError(error: any) {

    console.log("=======================");
    console.log(error);
    console.log("=======================");

    let message = 'Ha ocurrido un error';
    if (error.error && error.error.message) message = error.error.message;

    let status = 500;
    if (error.status) status = error.status;

    const httpError = { status: status, message: message };

    return Promise.reject(httpError);
  }

  getServiceName() {
    return this.serviceName;
  }

}
