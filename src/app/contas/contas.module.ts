import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';

import { ContasPageRoutingModule } from './contas-routing.module';

import { DespesaListaComponent } from './components/despesa-lista/despesa-lista.page';
import { DespesaCadastroComponent } from './components/contas-cadastro/contas-cadastro.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    IonicModule,
    ContasPageRoutingModule,
    HttpClientModule,
  ],
  declarations: [DespesaListaComponent, DespesaCadastroComponent]
})
export class DespesaPageModule {}
