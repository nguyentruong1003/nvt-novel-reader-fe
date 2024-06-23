import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './pages/profile/profile.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { DxDataGridModule, DxFormModule } from 'devextreme-angular';
import { ROUTER_UTILS } from './shared/utils/router.utils';

const routes: Routes = [
  {
    path: 'authentication',
    loadChildren: () => import('./pages/authentication/authentication.module').then((m) => m.AuthenticationModule)
  },
  {
    path: ROUTER_UTILS.profile.view,
    component: ProfileComponent,
  },
  {
    path: ROUTER_UTILS.base.home,
    loadChildren: () => import('./pages/public/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'tasks',
    component: TasksComponent
  },
  {
    path: ROUTER_UTILS.base.freeroute,
    redirectTo: ROUTER_UTILS.base.home
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true }), DxDataGridModule, DxFormModule],
  exports: [RouterModule],
  declarations: [
    ProfileComponent,
    TasksComponent
  ]
})
export class AppRoutingModule { }
