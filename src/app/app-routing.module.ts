import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';

const appRoutes: Routes = [

  { path: '',  component: HomepageComponent}  ];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { useHash: true })],

  exports: [RouterModule]
})
export class AppRoutingModule { 

}