import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public menus = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Movimentação', url: '/movimentacao', icon: 'cart' },
    { title: 'Contas', url: '/contas', icon: 'pricetags' },
    { title: 'Metas', url: '/metas', icon: 'analytics' },
  ];
  constructor() {}
}