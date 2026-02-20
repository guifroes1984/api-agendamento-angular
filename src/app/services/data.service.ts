import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { TransactionService } from './transaction.service';
import { TokenService } from './token.service';
import { Resumofinanceiro, Transacao } from '../models/transacao.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private transactionsSubject = new BehaviorSubject<Transacao[]>([]);
  private resumoSubject = new BehaviorSubject<Resumofinanceiro>({
    totalGanhos: 0,
    totalGastos: 0,
    lucroLiquido: 0,
    quantidadeTransacoes: 0
  });
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  transactions$ = this.transactionsSubject.asObservable();
  resumo$ = this.resumoSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  private monthlyGoalSubject = new BehaviorSubject<number>(3000);
  private profitGoalSubject = new BehaviorSubject<number>(1500);
  
  monthlyGoal$ = this.monthlyGoalSubject.asObservable();
  profitGoal$ = this.profitGoalSubject.asObservable();

  totalEarnings$ = this.resumo$.pipe(map(r => r.totalGanhos));
  totalExpenses$ = this.resumo$.pipe(map(r => r.totalGastos));
  netProfit$ = this.resumo$.pipe(map(r => r.lucroLiquido));

  earningsProgress$ = combineLatest([
    this.totalEarnings$,
    this.monthlyGoal$
  ]).pipe(
    map(([earnings, goal]) => {
      if (goal === 0) return 0;
      return Math.min((earnings / goal) * 100, 100);
    })
  );

  profitProgress$ = combineLatest([
    this.netProfit$,
    this.profitGoal$
  ]).pipe(
    map(([profit, goal]) => {
      if (goal === 0) return 0;
      return Math.min((profit / goal) * 100, 100);
    })
  );

  recentTransactions$ = this.transactions$.pipe(
    map(transacoes => transacoes.slice(0, 5))
  );

  constructor(
    private transactionService: TransactionService,
    private tokenService: TokenService
  ) {
    this.carregarMetas();
    if (this.tokenService.isLoggedIn()) {
      this.carregarDados();
    }
  }

  public carregarDados(): void {
    if (!this.tokenService.isLoggedIn()) return;

    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    Promise.all([
      this.transactionService.listarTodas().toPromise(),
      this.transactionService.obterResumo().toPromise()
    ]).then(([transacoes, resumo]) => {
      if (transacoes) this.transactionsSubject.next(transacoes);
      if (resumo) this.resumoSubject.next(resumo);
      this.loadingSubject.next(false);
    }).catch(erro => {
      this.errorSubject.next('Erro ao carregar dados do servidor');
      this.loadingSubject.next(false);
    });
  }

  async adicionarTransacao(transacao: Omit<Transacao, 'id' | 'usuarioId' | 'usuarioNome'>): Promise<void> {
    try {
      this.loadingSubject.next(true);
      const novaTransacao = await this.transactionService.criar(transacao).toPromise();
      
      if (novaTransacao) {
        const current = this.transactionsSubject.getValue();
        this.transactionsSubject.next([novaTransacao, ...current]);
        
        const resumo = await this.transactionService.obterResumo().toPromise();
        if (resumo) this.resumoSubject.next(resumo);
      }
      this.loadingSubject.next(false);
    } catch (erro) {
      this.loadingSubject.next(false);
      throw erro;
    }
  }

  async atualizarTransacao(id: number, transacao: Partial<Transacao>): Promise<void> {
    try {
      this.loadingSubject.next(true);
      
      const current = this.transactionsSubject.getValue();
      const original = current.find((t: Transacao) => t.id === id);
      if (!original) throw new Error('Transação não encontrada');

      const transacaoAtualizada = await this.transactionService.atualizar(id, {
        tipo: transacao.tipo || original.tipo,
        categoria: transacao.categoria || original.categoria,
        valor: transacao.valor || original.valor,
        data: transacao.data || original.data,
        descricao: transacao.descricao !== undefined ? transacao.descricao : original.descricao
      }).toPromise();

      if (transacaoAtualizada) {
        const updated = current.map((t: Transacao) => 
          t.id === id ? transacaoAtualizada : t
        );
        this.transactionsSubject.next(updated);

        const resumo = await this.transactionService.obterResumo().toPromise();
        if (resumo) this.resumoSubject.next(resumo);
      }
      this.loadingSubject.next(false);
    } catch (erro) {
      this.loadingSubject.next(false);
      throw erro;
    }
  }

  async deletarTransacao(id: number): Promise<void> {
    try {
      this.loadingSubject.next(true);
      await this.transactionService.deletar(id).toPromise();

      const current = this.transactionsSubject.getValue();
      const updated = current.filter((t: Transacao) => t.id !== id);
      this.transactionsSubject.next(updated);

      const resumo = await this.transactionService.obterResumo().toPromise();
      if (resumo) this.resumoSubject.next(resumo);
      
      this.loadingSubject.next(false);
    } catch (erro) {
      this.loadingSubject.next(false);
      throw erro;
    }
  }

  public atualizarMetas(monthly: number, profit: number): void {
    this.monthlyGoalSubject.next(monthly);
    this.profitGoalSubject.next(profit);
    localStorage.setItem('monthlyGoal', monthly.toString());
    localStorage.setItem('profitGoal', profit.toString());
  }

  public carregarMetas(): void {
    const monthly = localStorage.getItem('monthlyGoal');
    const profit = localStorage.getItem('profitGoal');
    if (monthly) this.monthlyGoalSubject.next(parseFloat(monthly));
    if (profit) this.profitGoalSubject.next(parseFloat(profit));
  }
}