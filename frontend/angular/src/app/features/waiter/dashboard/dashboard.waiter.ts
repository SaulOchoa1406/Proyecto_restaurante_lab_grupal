import { Component, signal } from '@angular/core';
import { TableList } from '../table-list/table-list';
import { TableDetail } from '../table-detail/table-detail';
import { Table } from '../../../core/models/table';

@Component({
  selector: 'app-dashboard',
  imports: [TableList, TableDetail],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardWaiter {
  selectedTable = signal<Table | null>(null);

  onTableSelected(table: Table): void {
    this.selectedTable.set(table);
  }

  closeDetail(): void {
    this.selectedTable.set(null);
  }
}
