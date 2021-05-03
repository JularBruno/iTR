export class Settings {
  // Global Settings
  public static APP_NAME = 'Diproach CMS';
  public static APP_VERSION = '0.0.1';


  //EndPoints
  public static endPoints = {
    categories: '/categories',
    companies: '/companies',
    files: '/files',
    orderItems: '/orderItems',
    toRider: '/toRider',
    users: '/users',


    suppliers: "/suppliers",
    products: '/products',
    transactions:"/transactions"
  };
  public static endPointsMethods = {
    addStock: "/addstock",
    subproducts:"/subproducts"
  };
  public static storage = {
    user: 'user'
  };

  public static products = {
    type: {
      product: {
        code: 'product',
        label: 'Producto físico'
      },
      service: {
        code: 'service',
        label: 'Servicio'
      }
    }
  }

  public static coupons = {
    type: [
      {
        code: 'product',
        label: 'Producto físico'
      },
      {
        code: 'service',
        label: 'Servicio'
      }
    ]
  }

  public static orders = {
    status: [
      {
        code: 'cancelled',
        label: 'Cancelado',
        color: 'danger'
      },
      {
        code: 'finished',
        label: 'Finalizado',
        color: 'success'
      },
      {
        code: 'inCart',
        label: 'En el carrito',
        color: 'info'
      },
      {
        code: 'pending',
        label: 'Pendiente',
        color: 'warning'
      },
      {
        code: 'process',
        label: 'En proceso',
        color: 'warning'
      },
    ],
    statusObj: {
      cancelled: {
        code: 'cancelled',
        label: 'Cancelado',
        color: 'danger'
      },
      finished: {
        code: 'finished',
        label: 'Finalizado',
        color: 'success'
      },
      inCart: {
        code: 'inCart',
        label: 'En el carrito',
        color: 'info'
      },
      pending: {
        code: 'pending',
        label: 'Pendiente',
        color: 'warning'
      },
      process: {
        code: 'process',
        label: 'En proceso',
        color: 'warning'
      },
    }
  }

  public static routes: any = {
    root: { path: '', redirectTo: '/home', pathMatch: 'full' },
    administrators: { path: 'administrators', data: { roles: ['administrator'] } },
    administratorChangePassword: { path: 'administrators/:id/changePassword', data: { roles: ['administrator'] } },
    administrator: { path: 'administrators/:id', data: { roles: ['administrator'] } },
    home: { path: 'home' }, // Change this please...
    login: { path: 'login' },
    users: { path: 'users', data: { roles: ['administrator'] } },
    user: { path: 'users/:id', data: { roles: ['administrator'] } },
    userChangePassword: { path: 'users/:id/changePassword', data: { roles: ['administrator'] } },
    subproducts: { path: 'subproducts', data: { roles: ['administrator'] } },
    subproduct: { path: 'subproducts/:id', data: { roles: ['administrator'] } },
    suppliers: { path: 'suppliers', data: { roles: ['administrator'] } },
    supplier: { path: 'suppliers/:id', data: { roles: ['administrator'] } },
    customers: { path: 'customers', data: { roles: ['administrator'] } },
    customer: { path: 'customers/:id', data: { roles: ['administrator'] } },
    products: { path: 'products', data: { roles: ['administrator'] } },
    product: { path: 'products/:id', data: { roles: ['administrator'] } },
  };

};
