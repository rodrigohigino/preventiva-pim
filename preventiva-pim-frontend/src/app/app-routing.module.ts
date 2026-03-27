import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EquipamentosComponent } from './pages/equipamentos/equipamentos.component';
import { PlanosComponent } from './pages/planos/planos.component';
import { ExecucoesComponent } from './pages/execucoes/execucoes.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'equipamentos', component: EquipamentosComponent, canActivate: [AuthGuard] },
  { path: 'planos', component: PlanosComponent, canActivate: [AuthGuard] },
  { path: 'execucoes', component: ExecucoesComponent, canActivate: [AuthGuard] },
  { path: 'app/dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'app/equipamentos', component: EquipamentosComponent, canActivate: [AuthGuard] },
  { path: 'app/planos', component: PlanosComponent, canActivate: [AuthGuard] },
  { path: 'app/execucoes', component: ExecucoesComponent, canActivate: [AuthGuard] },
  { path: 'app', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
