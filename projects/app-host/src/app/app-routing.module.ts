import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DynamicComponent } from './pages/dynamic/dynamic.component';

const routes: Routes = [
  {
    path: '**',
    component: DynamicComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
