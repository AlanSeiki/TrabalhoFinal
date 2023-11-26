import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'movimentacao',
    loadChildren: () =>
      import('./movimentacao/movimentacao.module').then((m) => m.MovimentacaoPageModule),
  },
  {
    path: 'contas',
    loadChildren: () =>
      import('./contas/contas.module').then((m) => m.ContasPageModule),
  },
  {
    path: 'metas',
    loadChildren: () =>
      import('./metas/metas.module').then((m) => m.MetasPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
