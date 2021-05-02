import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { UserComponent } from './modules/users/user.component';
import { UsersComponent } from './modules/users/users.component';
import { UserChangePasswordComponent } from './modules/users/user.change.password.component';

import { AdministratorComponent } from './modules/administrators/administrator.component';
import { AdministratorChangePasswordComponent } from './modules/administrators/administrator.change.password.component';
import { AdministratorsComponent } from './modules/administrators/administrators.component';
import { LoginComponent } from './modules/login/login.component';
import { HomeComponent } from './modules/home/home.component';
import { HttpGuard } from './core/http.guard';
import { Settings } from './app.settings';

import { ProductComponent } from './modules/products/product.component';
import { ProductsComponent } from './modules/products/products.component';
import { SupplierComponent } from './modules/suppliers/supplier.component';
import { SuppliersComponent } from './modules/suppliers/suppliers.component';
import { CustomersComponent } from './modules/customers/customers.component';
import { CustomerComponent } from './modules/customers/customer.component';
import { SubproductComponent } from './modules/subproducts/subproduct.component';
import { SubproductsComponent } from './modules/subproducts/subproducts.component';



Settings.routes.administrators.component = AdministratorsComponent;
Settings.routes.administratorChangePassword.component = AdministratorChangePasswordComponent;
Settings.routes.administrator.component = AdministratorComponent;
Settings.routes.home.component = HomeComponent;
Settings.routes.login.component = LoginComponent;
Settings.routes.userChangePassword.component = UserChangePasswordComponent;
Settings.routes.users.component = UsersComponent;
Settings.routes.user.component = UserComponent;
Settings.routes.product.component = ProductComponent;
Settings.routes.products.component = ProductsComponent;
Settings.routes.supplier.component = SupplierComponent;
Settings.routes.suppliers.component = SuppliersComponent;
Settings.routes.customers.component = CustomersComponent;
Settings.routes.customer.component = CustomerComponent;
Settings.routes.subproducts.component = SubproductsComponent;
Settings.routes.subproduct.component = SubproductComponent;

let routes: Routes = [];
for (let routeKey in Settings.routes) {
  let route = Settings.routes[routeKey];
  let r: any = {};
  if (route.path || route.path == '') r.path = route.path;
  if (route.redirectTo) r.redirectTo = route.redirectTo;
  if (route.pathMatch) r.pathMatch = route.pathMatch;
  if (route.component) r.component = route.component;
  if (route.data) {
    r.data = route.data;
    r.canActivate = [HttpGuard];
  }
  routes.push(r);
}


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
