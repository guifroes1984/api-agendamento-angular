import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Transacao } from 'src/app/models/transacao.model';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss']
})
export class TransactionFormComponent implements OnInit, OnChanges {

  @Input() transaction: Transacao | null = null;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  isEditMode = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.inicializarForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transaction'] && !changes['transaction'].firstChange) {
      this.isEditMode = !!this.transaction;
      this.atualizarForm();
    }
  }

  public inicializarForm(): void {
    const hoje = new Date();
    const dataAtual = this.formatarData(hoje);

    this.form = this.fb.group({
      tipo: [this.transaction?.tipo || 'GANHO', Validators.required],
      categoria: [this.transaction?.categoria || '', Validators.required],
      valor: [this.transaction?.valor || '', [Validators.required, Validators.min(0.01)]],
      data: [this.transaction?.data || dataAtual, Validators.required],
      descricao: [this.transaction?.descricao || '']
    });

    this.isEditMode = !!this.transaction;
  }

  public atualizarForm(): void {
    if (this.form && this.transaction) {
      this.form.patchValue({
        tipo: this.transaction.tipo,
        categoria: this.transaction.categoria,
        valor: this.transaction.valor,
        data: this.transaction.data,
        descricao: this.transaction.descricao || ''
      });
    }
  }

  public formatarData(date: Date): string {
    const dia = date.getDate().toString().padStart(2, '0');
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  get tipo() { return this.form.get('tipo'); }
  get categoria() { return this.form.get('categoria'); }
  get valor() { return this.form.get('valor'); }
  get data() { return this.form.get('data'); }
  get descricao() { return this.form.get('descricao'); }

}
