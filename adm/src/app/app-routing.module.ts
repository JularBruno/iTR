import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RiderComponent } from './modules/riders/rider.component';
import { RidersComponent } from './modules/riders/riders.component';
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
import { BannersComponent } from './modules/banners/banners.component';
import { BannerComponent } from './modules/banners/banner.component';
import { ProductComponent } from './modules/products/product.component';
import { ProductsComponent } from './modules/products/products.component';
import { OrderComponent } from './modules/orders/order.component';
import { OrdersComponent } from './modules/orders/orders.component';
import { CouponsComponent } from './modules/coupons/coupons.component';
import { CouponComponent } from './modules/coupons/coupon.component';
import { CompaniesComponent } from './modules/companies/companies.component';
import { CompanyComponent } from './modules/companies/company.component';
import { CategoriesComponent } from './modules/categories/categories.component';
import { CategoryComponent } from './modules/categories/category.component';
import { SupplierComponent } from './modules/suppliers/supplier.component';
import { SuppliersComponent } from './modules/suppliers/suppliers.component';
import { CustomersComponent } from './modules/customers/customers.component';
import { CustomerComponent } from './modules/customers/customer.component';
import { SubproductComponent } from './modules/subproducts/subproduct.component';
import { SubproductsComponent } from './modules/subproducts/subproducts.component';


Settings.routes.rider.component = RiderComponent;
Settings.routes.riders.component = RidersComponent;
Settings.routes.administrators.component = AdministratorsComponent;
Settings.routes.administratorChangePassword.component = AdministratorChangePasswordComponent;
Settings.routes.administrator.component = AdministratorComponent;
Settings.routes.home.component = HomeComponent;
Settings.routes.login.component = LoginComponent;
Settings.routes.userChangePassword.component = UserChangePasswordComponent;
Settings.routes.users.component = UsersComponent;
Settings.routes.user.component = UserComponent;
Settings.routes.banner.component = BannerComponent;
Settings.routes.banners.component = BannersComponent;
Settings.routes.product.component = ProductComponent;
Settings.routes.products.component = ProductsComponent;
Settings.routes.order.component = OrderComponent;
Settings.routes.orders.component = OrdersComponent;
Settings.routes.categories.component = CategoriesComponent;
Settings.routes.category.component = CategoryComponent;
Settings.routes.coupon.component = CouponComponent;
Settings.routes.coupons.component = CouponsComponent;
Settings.routes.companies.component = CompaniesComponent;
Settings.routes.company.component = CompanyComponent;
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
