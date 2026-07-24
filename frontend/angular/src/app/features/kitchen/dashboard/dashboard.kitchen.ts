import { Component } from '@angular/core';
import { PendingOrders } from '../pending-orders/pending-orders';

@Component({
  selector: 'app-dashboard',
  imports: [PendingOrders],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardKitchen {}
