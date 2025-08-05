import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { DashboardHomeComponent } from './home/components/dashboard-home/dashboard-home.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    component: LoginComponent
  },
 {
    path: 'rifa/:id', // 👈 esto ahora recibe el id del sorteo
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
  path: 'home',
  component: DashboardHomeComponent,
  canActivate: [AuthGuard]
}
];
