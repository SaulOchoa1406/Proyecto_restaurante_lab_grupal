import { Component, inject, signal } from '@angular/core';
import { interval, startWith, Subscription, switchMap } from 'rxjs';
import { OrderService } from '../../../core/services/order';
import { Order, OrderStatus } from '../../../core/models/order';

@Component({
  selector: 'app-pending-orders',
  imports: [],
  templateUrl: './pending-orders.html',
  styleUrl: './pending-orders.css',
})
export class PendingOrders {
  private readonly orderService = inject(OrderService);
  private subscription?: Subscription;

  orders = signal<Order[]>([]);
  loading = signal(true);
  error = signal('');
  processing = signal<number | null>(null);

  ngOnInit(): void {
    this.subscription = interval(7000)
      .pipe(
        startWith(0),
        switchMap(() => this.orderService.list())
      )
      .subscribe({
        next: (orders) => {
          const enCocina = orders
            .filter((p) => p.status === 'PENDIENTE' || p.status === 'EN_PREPARACION')
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

          this.orders.set(enCocina);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('No se pudieron cargar los pedidos.');
          this.loading.set(false);
        },
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  avanzar(pedido: Order): void {
    const next: OrderStatus = pedido.status === 'PENDIENTE' ? 'EN_PREPARACION' : 'LISTO';

    this.processing.set(pedido.id);

    this.orderService.updateStatus(pedido.id, next).subscribe({
      next: () => {
        this.orders.update((lista) =>
          next === 'LISTO'
            ? lista.filter((p) => p.id !== pedido.id)
            : lista.map((p) => (p.id === pedido.id ? { ...p, estado: next } : p))
        );
        this.processing.set(null);
      },
      error: () => {
        this.error.set('No se pudo actualizar el pedido.');
        this.processing.set(null);
      },
    });
  }
}
