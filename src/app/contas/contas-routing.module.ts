import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ContasCadastroComponent} from '../contas/components/contas-cadastro.components';

import { ContasPage } from './contas.page';

const routes: Routes = [
  {
    path: '',
    component: ContasPage
  },
  {
    path: 'cadastro',
    component: ContasCadastroComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContasPageRoutingModule {}