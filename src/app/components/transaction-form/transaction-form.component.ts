import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../models/categoria.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss']
})
export class TransactionFormComponent implements OnInit, OnChanges {
  @Input() transaction: any = null;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  entryForm: FormGroup;
  isEditMode = false;
  entryType: 'earning' | 'expense' = 'earning';
  selectedFileName: string | null = null;

  earningCategories: Categoria[] = [];
  expenseCategories: Categoria[] = [];
  paymentMethods: Categoria[] = [];

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService
  ) {
    this.entryForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      date: ['', Validators.required],
      categoryId: ['', Validators.required],
      description: [''],
      liters: [''],
      paymentMethod: ['']
    });
  }

  async ngOnInit(): Promise<void> {
    await this.carregarCategorias();
    if (!this.isEditMode) {
      this.resetForm();
    }
  }

  carregarCategorias(): Promise<void> {
    return new Promise((resolve) => {
      forkJoin({
        ganho: this.categoriaService.buscarCategoriasGanho(),
        gasto: this.categoriaService.buscarCategoriasGasto(),
        pagamento: this.categoriaService.buscarMetodosPagamentos()
      }).subscribe({
        next: (result) => {
          this.earningCategories = result.ganho;
          this.expenseCategories = result.gasto;
          this.paymentMethods = result.pagamento;
          resolve();
        },
        error: (err) => {
          this.setFallbackCategories();
          resolve();
        }
      });
    });
  }

  setFallbackCategories(): void {
    this.earningCategories = [
      { id: 1, nome: 'Uber', tipo: 'GANHO' },
      { id: 2, nome: '99', tipo: 'GANHO' },
      { id: 3, nome: 'Corrida particular', tipo: 'GANHO' },
      { id: 4, nome: 'Entrega', tipo: 'GANHO' },
      { id: 5, nome: 'IFood', tipo: 'GANHO' },
      { id: 999, nome: 'Outros', tipo: 'GANHO' }
    ];
    this.expenseCategories = [
      { id: 6, nome: 'Combustível', tipo: 'GASTO' },
      { id: 7, nome: 'Manutenção', tipo: 'GASTO' },
      { id: 8, nome: 'Alimentação', tipo: 'GASTO' },
      { id: 9, nome: 'Estacionamento', tipo: 'GASTO' },
      { id: 10, nome: 'Pedágio', tipo: 'GASTO' },
      { id: 11, nome: 'Multa', tipo: 'GASTO' },
      { id: 12, nome: 'Lavagem', tipo: 'GASTO' },
      { id: 13, nome: 'Outros', tipo: 'GASTO' }
    ];
    this.paymentMethods = [
      { id: 14, nome: 'Dinheiro', tipo: 'PAGAMENTO' },
      { id: 15, nome: 'Pix', tipo: 'PAGAMENTO' },
      { id: 16, nome: 'Crédito', tipo: 'PAGAMENTO' },
      { id: 17, nome: 'Débito', tipo: 'PAGAMENTO' },
      { id: 18, nome: 'Vale', tipo: 'PAGAMENTO' },
      { id: 19, nome: 'Outros', tipo: 'PAGAMENTO' }
    ];
  }

  resetForm(): void {
    const today = new Date().toISOString().split('T')[0];
    this.entryForm.setValue({
      amount: '',
      date: today,
      categoryId: '',
      description: '',
      liters: '',
      paymentMethod: ''
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transaction'] && changes['transaction'].currentValue) {
      this.isEditMode = true;
      this.entryType = this.transaction.tipo === 'GANHO' ? 'earning' : 'expense';

      if (this.paymentMethods.length > 0) {
        this.preencherFormularioEdicao();
      } else {
        setTimeout(() => this.preencherFormularioEdicao(), 200);
      }
    }
  }

  preencherFormularioEdicao(): void {

    const valorFormatado = this.transaction.valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    const dataFormatada = this.formatDateForInput(this.transaction.data);

    let paymentMethodId = null;
    if (this.transaction.paymentMethod) {
      const encontrado = this.paymentMethods.find(
        m => m.nome === this.transaction.paymentMethod
      );

      if (encontrado) {
        paymentMethodId = encontrado.id;
      }
    }
    this.entryForm.patchValue({
      amount: valorFormatado,
      date: dataFormatada,
      categoryId: this.transaction.categoriaId,
      description: this.transaction.descricao || '',
      liters: this.transaction.litros || '',
      paymentMethod: paymentMethodId
    });
  }

  getCategoriaId(nome: string): number | null {
    const categoriaGasto = this.expenseCategories.find(c => c.nome === nome);
    if (categoriaGasto) return categoriaGasto.id;
    const categoriaGanho = this.earningCategories.find(c => c.nome === nome);
    if (categoriaGanho) return categoriaGanho.id;

    return null;
  }

  setEntryType(type: 'earning' | 'expense'): void {
    this.entryType = type;
    this.entryForm.patchValue({
      categoryId: '',
      liters: '',
      paymentMethod: ''
    });
  }

  onAmountInput(event: any): void {
    let value = event.target.value;
    value = value.replace(/\D/g, '');

    if (value) {
      const numberValue = parseFloat(value) / 100;
      const formattedValue = numberValue.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      this.entryForm.patchValue({ amount: formattedValue }, { emitEvent: false });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
    }
  }

  formatDateForInput(dateStr: string): string {
    if (!dateStr) return '';
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month}-${day}`;
    }
    return dateStr;
  }

  formatDateToBackend(dateStr: string): string {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }

  onSubmit(): void {
    if (this.entryForm.valid) {
      const formValue = this.entryForm.value;

      let amount = formValue.amount;
      if (typeof amount === 'string') {
        amount = amount.replace(/\./g, '').replace(',', '.');
        amount = parseFloat(amount);
      }

      let paymentMethodNome = null;
      if (formValue.paymentMethod && this.paymentMethods.length > 0) {

        const metodoEncontrado = this.paymentMethods.find(
          m => m.id === Number(formValue.paymentMethod)
        );

        paymentMethodNome = metodoEncontrado ? metodoEncontrado.nome : null;
      }

      const transactionData: any = {
        tipo: this.entryType === 'earning' ? 'GANHO' : 'GASTO',
        categoriaId: formValue.categoryId,
        valor: amount,
        data: this.formatDateToBackend(formValue.date),
        descricao: formValue.description || '',
        litros: formValue.liters || null,
        paymentMethod: paymentMethodNome
      };

      this.save.emit(transactionData);
    } else {
      this.entryForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    this.onCancel();
  }

  get amount() { return this.entryForm.get('amount'); }
  get date() { return this.entryForm.get('date'); }
  get categoryId() { return this.entryForm.get('categoryId'); }
  get description() { return this.entryForm.get('description'); }
  get liters() { return this.entryForm.get('liters'); }
  get paymentMethod() { return this.entryForm.get('paymentMethod'); }
}