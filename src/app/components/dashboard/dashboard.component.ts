import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { TokenService } from '../../services/token.service';
import { DataService } from '../../services/data.service';
import { Transacao } from '../../models/transacao.model';
import { NotificationService } from 'src/app/services/notification.service';
import { UiService } from 'src/app/services/ui.service';
import { UploadService } from 'src/app/services/upload.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  user: any;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  showTransactionForm = false;
  showDeleteConfirm = false;
  editingTransaction: Transacao | null = null;
  private transactionToDelete: number | null = null;
  private subscription!: Subscription;

  loading$: Observable<boolean> = this.dataService.loading$;
  error$: Observable<string | null> = this.dataService.error$;

  totalEarnings$: Observable<number> = this.dataService.totalEarnings$;
  totalExpenses$: Observable<number> = this.dataService.totalExpenses$;
  netProfit$: Observable<number> = this.dataService.netProfit$;

  monthlyGoal$: Observable<number> = this.dataService.monthlyGoal$;
  profitGoal$: Observable<number> = this.dataService.profitGoal$;
  earningsProgress$: Observable<number> = this.dataService.earningsProgress$;
  profitProgress$: Observable<number> = this.dataService.profitProgress$;

  transactions$: Observable<Transacao[]> = this.dataService.transactions$;
  recentTransactions$: Observable<Transacao[]> = this.dataService.recentTransactions$;

  constructor(
    private tokenService: TokenService,
    private router: Router,
    public dataService: DataService,
    private notification: NotificationService,
    private uiService: UiService,
    private uploadService: UploadService
  ) { }

  ngOnInit(): void {
    this.user = this.tokenService.getUser();

    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }

    this.dataService.carregarDados();

    this.subscription = this.uiService.openTransactionForm$.subscribe(() => {
      this.openNewTransaction();
    });
    window.addEventListener('comprovante-removido', (event: any) => {
    this.dataService.carregarDados();
  });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public logout(): void {
    this.dataService.limparDados();
    this.tokenService.signOut();
    this.router.navigate(['/login']);
  }

  openNewTransaction(): void {
    this.editingTransaction = null;
    this.showTransactionForm = true;
  }

  openEditTransaction(transaction: Transacao): void {
    this.editingTransaction = transaction;
    this.showTransactionForm = true;
  }

  closeTransactionForm(): void {
    this.showTransactionForm = false;
    this.editingTransaction = null;
  }

  async saveTransaction(transactionData: any): Promise<void> {

    try {
      let transacaoSalva;

      if (this.editingTransaction) {
        transacaoSalva = await this.dataService.atualizarTransacao(
          this.editingTransaction.id,
          transactionData
        );
        this.notification.showSuccess('Transação atualizada com sucesso!');
      } else {
        transacaoSalva = await this.dataService.adicionarTransacao(transactionData);
        this.notification.showSuccess('Transação criada com sucesso!');
      }

      if (transactionData.arquivo && transacaoSalva?.id) {

        await this.uploadService.uploadComprovante(transacaoSalva.id, transactionData.arquivo).toPromise();

        await this.dataService.carregarDados();

        this.notification.showInfo('Comprovante anexado com sucesso!');
      }

      this.closeTransactionForm();
    } catch (error) {
      this.notification.showError('Erro ao salvar transação');
    }
  }

  requestDeleteTransaction(id: number): void {
    this.transactionToDelete = id;
    this.showDeleteConfirm = true;
  }

  async confirmDelete(): Promise<void> {
    if (this.transactionToDelete) {
      try {
        await this.dataService.deletarTransacao(this.transactionToDelete);
        this.notification.showSuccess('Transação excluída com sucesso!');
      } catch (error) {
        this.notification.showError('Erro ao excluir transação.');
      }
    }
    this.cancelDelete();
  }

  cancelDelete(): void {
    this.transactionToDelete = null;
    this.showDeleteConfirm = false;
  }

  trackById(index: number, item: Transacao): number {
    return item.id;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  visualizarComprovante(transacaoId: number): void {
    this.uploadService.buscarPorTransacaoId(transacaoId).subscribe({
      next: (comprovante: any) => {
        const urlCompleta = environment.baseUrl + comprovante.caminho;
        window.open(urlCompleta, '_blank');
      }
    });
  }

}