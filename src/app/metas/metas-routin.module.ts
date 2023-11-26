import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MetasPage } from './metas.page';
import { MetasCadastroComponent } from './compotentes/meta-cadastro';

const routes: Routes = [
  {
    path: '',
    component: MetasPage
  },
  {
    path: 'cadastro',
    component: MetasCadastroComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MetasPageRoutingModule {}
