import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContasPageRoutingModule } from './contas-routing.module';

import { ContasPage } from './contas.page';
import { ContasCadastroComponent } from './components/contas-cadastro.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContasPageRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  declarations: [ContasPage,ContasCadastroComponent]
})
export class ContasPageModule {}

