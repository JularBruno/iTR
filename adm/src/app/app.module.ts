import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { ErrorHandler, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs);

// import {
//   MAT_MOMENT_DATE_FORMATS,
//   MomentDateAdapter,
//   MAT_MOMENT_DATE_ADAPTER_OPTIONS,
// } from '@angular/material-moment-adapter';
// import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

// import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
// import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import { MAT_DATE_LOCALE } from '@angular/material/core';

import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { DpDatePickerModule } from 'ng2-date-picker';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';

// Material Design

// import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';


import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
// import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';

import { UsersComponent } from './modules/users/users.component';
import { UserComponent } from './modules/users/user.component';
import { UserChangePasswordComponent } from './modules/users/user.change.password.component';

import { AdministratorsComponent } from './modules/administrators/administrators.component';
import { AdministratorComponent } from './modules/administrators/administrator.component';
import { AdministratorChangePasswordComponent } from './modules/administrators/administrator.change.password.component';
import { HomeComponent } from './modules/home/home.component';
import { LoginComponent } from './modules/login/login.component';

import { MapComponent } from './core/components/map/map.component';
import { ProductsComponent } from './modules/products/products.component';
import { ProductComponent } from './modules/products/product.component';

import { SuppliersComponent } from './modules/suppliers/suppliers.component'
import { SupplierComponent } from './modules/suppliers/supplier.component'
import { CustomersComponent } from './modules/customers/customers.component'
import { CustomerComponent } from './modules/customers/customer.component'
import { SubproductComponent } from './modules/subproducts/subproduct.component'
import { SubproductsComponent } from './modules/subproducts/subproducts.component'
import { SalesComponent } from './modules/sales/sales.component'
import { SaleComponent } from './modules/sales/sale.component'
import { DolarsComponent } from './modules/dolars/dolars.component'

import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { NgxPrintModule } from 'ngx-print';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    UserComponent,
    UserChangePasswordComponent,
    HomeComponent,
    LoginComponent,
    AdministratorComponent,
    AdministratorChangePasswordComponent,
    AdministratorsComponent,
    MapComponent,
    ProductComponent,
    ProductsComponent,
    SuppliersComponent,
    SupplierComponent,
    CustomersComponent,
    CustomerComponent,
    SubproductsComponent,
    SubproductComponent,
    SalesComponent,
    SaleComponent,
    DolarsComponent,
  ],
  imports: [

    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    MatToolbarModule, MatSidenavModule, MatIconModule, MatListModule, MatSliderModule, MatTableModule, MatDialogModule,
    MatInputModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatCheckboxModule, MatDatepickerModule, MatRadioModule, MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,

    NgxMaterialTimepickerModule.setLocale('es-AR'),

    DpDatePickerModule,

    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    ZXingScannerModule,
    NgxPrintModule
  ],
  exports: [
    // HttpModule,
  ],
  providers: [
    { provide: ErrorHandler },
    { provide: LOCALE_ID, useValue: 'es-AR' },

    // {provide: MAT_DATE_LOCALE, useValue: 'es-AR'},
    // {
    //   provide: DateAdapter,
    //   useClass: MomentDateAdapter,
    //   deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    // },
    // {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},

    // {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    // {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},


    { provide: MAT_DATE_LOCALE, useValue: 'es-AR' },
    // {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}},

    MatDatepickerModule,
    // NgxMatDatepicker
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
