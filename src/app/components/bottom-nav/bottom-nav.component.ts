import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss']
})
export class BottomNavComponent {
  activeTab: string = 'inicio';

  constructor(
    private router: Router, 
    private uiService: UiService
  ) {}

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    console.log('Tab ativada:', tab);
    
    switch(tab) {
      case 'inicio':
        this.router.navigate(['/dashboard']);
        break;
      case 'desempenho':
        // Implementar depois
        console.log('Navegar para desempenho');
        break;
      case 'relatorios':
        // Implementar depois
        console.log('Navegar para relatórios');
        break;
      case 'perfil':
        // Implementar depois
        console.log('Navegar para perfil');
        break;
    }
  }

  openNewTransaction(): void {
    console.log('BottomNav: openNewTransaction clicado'); // <-- ADICIONE ESTE LOG
    this.uiService.openTransactionForm();
  }
}
