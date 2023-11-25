import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LucroDespesaCadastroComponent } from './components/movimentacao-cadastro/movimentacao-cadastro.component';

import { MovimentacaoListaComponent } from './components/movimentacao-lista/movimentacao-lista.page';

const routes: Routes = [
  {
    path: '',
    component: MovimentacaoListaComponent
  },
  {
    path: 'edicao/:id/:tipo',
    component: LucroDespesaCadastroComponent
  },
  {
    path: 'cadastro/:tipo',
    component: LucroDespesaCadastroComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MovimentacaoPageRoutingModule {}
