import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
// import { Register } from './features/auth/register/register';
import { Dashboard as AdminDashboard } from './features/admin/dashboard/dashboard';
import { DashboardWaiter } from './features/waiter/dashboard/dashboard.waiter';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import { Users } from './features/admin/users/users';
import { DashboardKitchen } from './features/kitchen/dashboard/dashboard.kitchen';
import { Products } from './features/admin/products/products';
import { Tables } from './features/admin/tables/tables';
import { Reports } from './features/admin/reports/reports';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'admin',
    canActivate: [authGuard, roleGuard('ADMIN')],
    children: [
      { path: '', component: AdminDashboard },
      { path: 'users', component: Users },
      { path: 'products', component: Products },
      { path: 'tables', component: Tables },
      { path: 'reports', component: Reports },
    ],
  },

  {
    path: 'waiter',
    component: DashboardWaiter,
    canActivate: [authGuard, roleGuard('MOZO')],
  },

  {
    path: 'kitchen',
    component: DashboardKitchen,
    canActivate: [authGuard, roleGuard('COCINERO')]
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];
