import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderDetail } from '../../../core/models/order-detail';

@Component({
  selector: 'app-order-sumary',
  imports: [],
  templateUrl: './order-sumary.html',
  styleUrl: './order-sumary.css',
})
export class OrderSumary {
  @Input({ required: true }) detalles: OrderDetail[] = [];
  @Input() editable = false;
  @Output() eliminar = new EventEmitter<number>();
}
