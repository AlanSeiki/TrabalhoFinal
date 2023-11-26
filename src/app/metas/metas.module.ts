import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

import { MetasPageRoutingModule } from './metas-routin.module';
import { MetasCadastroComponent } from './compotentes/meta-cadastro';
import { MetasVisualizadorCadastroComponent } from './meta_visualizador/meta-visualizador';

import { MetasPage } from './metas.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    MetasPageRoutingModule,
    HttpClientModule
  ],
  declarations: [MetasPage,MetasCadastroComponent,MetasVisualizadorCadastroComponent]
})
export class MetasPageModule {}