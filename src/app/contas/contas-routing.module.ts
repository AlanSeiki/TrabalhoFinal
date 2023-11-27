import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ContasCadastroComponent} from './components/contas-cadastro.component';

import { ContasPage } from './contas.page';

const routes: Routes = [
  {
    path: '',
    component: ContasPage
  },
  {
    path: 'cadastro',
    component: ContasCadastroComponent
  },
  {
    path: 'editar/:id',
    component: ContasCadastroComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContasPageRoutingModule {}