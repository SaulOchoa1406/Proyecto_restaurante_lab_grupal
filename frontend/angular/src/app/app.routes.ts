import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
// import { Register } from './features/auth/register/register';
import { Dashboard } from './features/admin/dashboard/dashboard';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import { Users } from './features/admin/users/users';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'admin/users',
    component: Users,
    canActivate: [authGuard, roleGuard('ADMIN')]
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'waiter',
    component: Dashboard,
    canActivate: [
      authGuard,
      roleGuard('MOZO')
    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];
