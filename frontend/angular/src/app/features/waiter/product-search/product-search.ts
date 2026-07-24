import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { Product } from '../../../core/models/product';

@Component({
  selector: 'app-product-search',
  imports: [FormsModule],
  templateUrl: './product-search.html',
  styleUrl: './product-search.css',
})
export class ProductSearch {
  private readonly productService = inject(ProductService);
  private readonly terminos = new Subject<string>();

  @Output() productoElegido = new EventEmitter<{ producto: Product; cantidad: number }>();

  query = '';
  resultados = signal<Product[]>([]);
  seleccionado = signal<Product | null>(null);
  cantidad = 1;

  constructor() {
    this.terminos
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((termino) => this.productService.search(termino))
      )
      .subscribe((productos) => this.resultados.set(productos));
  }

  onInput(): void {
    this.seleccionado.set(null);
    this.terminos.next(this.query);
  }

  elegir(producto: Product): void {
    this.seleccionado.set(producto);
    this.resultados.set([]);
    this.query = producto.name;
  }

  agregar(): void {
    const producto = this.seleccionado();
    if (!producto || this.cantidad < 1) return;

    this.productoElegido.emit({ producto, cantidad: this.cantidad });

    this.seleccionado.set(null);
    this.query = '';
    this.cantidad = 1;
  }
}
