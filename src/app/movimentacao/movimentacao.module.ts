import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';

import { MovimentacaoPageRoutingModule } from './movimentacao-routing.module';

import { MovimentacaoListaComponent } from './components/movimentacao-lista/movimentacao-lista.page';
import { LucroDespesaCadastroComponent } from './components/movimentacao-cadastro/movimentacao-cadastro.component';
import { MetaCadastroComponent } from './components/movimentacao-cadastro-meta/movimentacao-cadastro-meta.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    IonicModule,
    MovimentacaoPageRoutingModule,
    HttpClientModule,
  ],
  declarations: [MovimentacaoListaComponent, LucroDespesaCadastroComponent,MetaCadastroComponent]
})
export class MovimentacaoPageModule {}
