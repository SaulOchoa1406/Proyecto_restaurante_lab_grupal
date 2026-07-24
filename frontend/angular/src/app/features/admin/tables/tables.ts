import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Table } from '../../../core/models/table';
import { TableService } from '../../../core/services/table';

@Component({
  selector: 'app-tables',
  imports: [ReactiveFormsModule],
  templateUrl: './tables.html',
  styleUrl: './tables.css',
})
export class Tables {
  private readonly fb = inject(FormBuilder);
  private readonly tableService = inject(TableService);

  mesas = signal<Table[]>([]);
  loading = signal(true);
  error = signal('');

  form = this.fb.nonNullable.group({
    numero: [0, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.tableService.list().subscribe({
      next: (mesas) => {
        this.mesas.set(mesas);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las mesas.');
        this.loading.set(false);
      },
    });
  }

  crear(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.error.set('');

    this.tableService.create(this.form.getRawValue().numero).subscribe({
      next: () => {
        this.form.reset({ numero: 0 });
        this.cargar();
      },
      error: () => this.error.set('No se pudo crear la mesa (¿el número ya existe?).'),
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar esta mesa?')) return;

    this.tableService.delete(id).subscribe({
      next: () => this.cargar(),
      error: () => this.error.set('No se pudo eliminar: la mesa tiene pedidos registrados.'),
    });
  }
}