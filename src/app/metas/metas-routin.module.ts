import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MetasPage } from './metas.page';
import { MetasCadastroComponent } from './compotentes/meta-cadastro';
import { MetasVisualizadorCadastroComponent } from './meta_visualizador/meta-visualizador';

const routes: Routes = [
  {
    path: '',
    component: MetasPage
  },
  {
    path: 'cadastro',
    component: MetasCadastroComponent
  },
  {
    path: 'editar/:id',
    component: MetasCadastroComponent
  },
  {
    path: 'visualizar/:id',
    component: MetasVisualizadorCadastroComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MetasPageRoutingModule {}
