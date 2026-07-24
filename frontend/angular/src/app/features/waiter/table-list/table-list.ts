import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { Table } from '../../../core/models/table';
import { TableService } from '../../../core/services/table';
import { interval, startWith, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-table-list',
  imports: [],
  templateUrl: './table-list.html',
  styleUrl: './table-list.css',
})
export class TableList {
  @Output() tableSelected = new EventEmitter<Table>();

  private readonly tableService = inject(TableService);
  private subscription?: Subscription;

  tables = signal<Table[]>([]);
  loading = signal(true);
  error = signal('');

  ngOnInit(): void {
    this.subscription = interval(7000)
      .pipe(
        startWith(0),
        switchMap(() => this.tableService.list())
      )
      .subscribe({
        next: (tables) => {
          this.tables.set(tables);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('No se pudieron cargar las mesas.');
          this.loading.set(false);
        },
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  select(table: Table): void {
    this.tableSelected.emit(table);
  }
}
