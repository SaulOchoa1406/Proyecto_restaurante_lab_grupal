import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ProductSearch } from '../product-search/product-search';
import { OrderSumary } from '../order-sumary/order-sumary';
import { Order } from '../../../core/models/order';
import { Product } from '../../../core/models/product';
import { Table } from '../../../core/models/table';
import { OrderService } from '../../../core/services/order';

@Component({
  selector: 'app-table-detail',
  imports: [ReactiveFormsModule, ProductSearch, OrderSumary],
  templateUrl: './table-detail.html',
  styleUrl: './table-detail.css',
})
export class TableDetail {
  @Input({ required: true }) table!: Table;
  @Output() closed = new EventEmitter<void>();

  private readonly orderService = inject(OrderService);
  private readonly fb = inject(FormBuilder);

  loading = signal(true);
  error = signal('');
  pedido = signal<Order | null>(null);
  creating = signal(false);
  cobrando = signal(false);

  clienteForm = this.fb.nonNullable.group({
    customer_name: [''],
    customer_dni: [''],
  });

  loadPedido(): void {
    this.loading.set(true);
    this.orderService.getActiveByTable(this.table.id).subscribe({
      next: (pedidos) => {
        const activo = pedidos[0] ?? null;
        this.pedido.set(activo);

        if (activo) {
          this.clienteForm.patchValue({
            customer_name: activo.customer_name,
            customer_dni: activo.customer_dni,
          });
        }

        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el pedido de la mesa.');
        this.loading.set(false);
      },
    });
  }

  crearPedido(): void {
    this.creating.set(true);
    this.orderService.create(this.table.id).subscribe({
      next: (pedido) => {
        this.pedido.set(pedido);
        this.creating.set(false);
      },
      error: () => {
        this.error.set('No se pudo crear el pedido (¿ya hay uno activo en esta mesa?).');
        this.creating.set(false);
      },
    });
  }

  onProductoSeleccionado(evento: { producto: Product; cantidad: number }): void {
    const pedido = this.pedido();
    if (!pedido) return;

    this.orderService.addItem(pedido.id, evento.producto.id, evento.cantidad).subscribe({
      next: () => this.loadPedido(),
      error: () => this.error.set('No se pudo agregar el producto.'),
    });
  }

  eliminarItem(detalleId: number): void {
    this.orderService.removeItem(detalleId).subscribe({
      next: () => this.loadPedido(),
      error: () => this.error.set('No se pudo quitar el producto.'),
    });
  }

  guardarCliente(): void {
    const pedido = this.pedido();
    if (!pedido) return;

    this.orderService.updateCliente(pedido.id, this.clienteForm.getRawValue()).subscribe({
      next: (actualizado) => this.pedido.set(actualizado),
      error: () => this.error.set('No se pudo guardar los datos del cliente.'),
    });
  }

  marcarEntregado(): void {
    const pedido = this.pedido();
    if (!pedido) return;

    this.orderService.updateStatus(pedido.id, 'ENTREGADO').subscribe({
      next: (actualizado) => this.pedido.set(actualizado),
      error: () => this.error.set('No se pudo marcar como entregado.'),
    });
  }

  cobrar(): void {
    const pedido = this.pedido();
    if (!pedido) return;

    this.cobrando.set(true);
    this.orderService.charge(pedido.id).subscribe({
      next: (blob) => {
        this.descargarPdf(blob, pedido.id);
        this.cobrando.set(false);
        this.close();
      },
      error: () => {
        this.error.set('No se pudo generar la boleta.');
        this.cobrando.set(false);
      },
    });
  }

  private descargarPdf(blob: Blob, pedidoId: number): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `boleta_${pedidoId}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  close(): void {
    this.closed.emit();
  }
}
