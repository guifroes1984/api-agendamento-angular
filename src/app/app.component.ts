import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showBottomNav = true;
  rotasSemMenu = ['/login', '/register'];

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const urlAtual = event.urlAfterRedirects;
      this.showBottomNav = !this.rotasSemMenu.includes(urlAtual);
    });
  }
}
