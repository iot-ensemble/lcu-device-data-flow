import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './controls/home/home.component';
import { AdminComponent } from './controls/admin/admin.component';
import { ManageComponent } from './controls/manage/manage.component';

const routes: Routes = [
  { path: 'admin', component: AdminComponent },
  { path: 'manage', component: ManageComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [
      RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
