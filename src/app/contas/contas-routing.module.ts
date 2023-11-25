import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DespesaCadastroComponent } from './components/contas-cadastro/contas-cadastro.component';

import { DespesaListaComponent } from './components/despesa-lista/despesa-lista.page';

const routes: Routes = [
  {
    path: '',
    component: DespesaListaComponent
  },
  {
    path: 'edicao/:id/:tipo',
    component: DespesaListaComponent
  },
  {
    path: 'cadastro/:tipo',
    component: DespesaListaComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContasPageRoutingModule {}