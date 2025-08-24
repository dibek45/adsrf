import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { MisRifasComponent } from './components/dashboard-home/dashboard-home.component';

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
  component: MisRifasComponent,
  canActivate: [AuthGuard]
}
];
