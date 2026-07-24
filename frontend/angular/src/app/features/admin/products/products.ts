import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../../core/models/category';
import { Product } from '../../../core/models/product';
import { ProductService } from '../../../core/services/product';

@Component({
  selector: 'app-products',
  imports: [ReactiveFormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);

  productos = signal<Product[]>([]);
  categorias = signal<Category[]>([]);
  loading = signal(true);
  error = signal('');
  success = signal('');
  editandoId = signal<number | null>(null);

  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    descripcion: [''],
    precio: [0, [Validators.required, Validators.min(0.01)]],
    categoria_id: [0, [Validators.required, Validators.min(1)]],
    activo: [true],
  });

  categoriaForm = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
  });

  ngOnInit(): void {
    this.cargarTodo();
  }

  cargarTodo(): void {
    this.loading.set(true);

    this.productService.categories().subscribe({
      next: (categorias) => this.categorias.set(categorias),
      error: () => this.error.set('No se pudieron cargar las categorías.'),
    });

    this.productService.list().subscribe({
      next: (productos) => {
        this.productos.set(productos);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los productos.');
        this.loading.set(false);
      },
    });
  }

  guardarProducto(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.error.set('');
    this.success.set('');
    const data = this.form.getRawValue();
    const id = this.editandoId();

    const request = id ? this.productService.update(id, data) : this.productService.create(data);

    request.subscribe({
      next: () => {
        this.success.set(id ? 'Producto actualizado.' : 'Producto creado.');
        this.cancelarEdicion();
        this.cargarTodo();
      },
      error: () => this.error.set('No se pudo guardar el producto.'),
    });
  }

  editar(producto: Product): void {
    this.editandoId.set(producto.id);
    this.form.setValue({
      nombre: producto.name,
      descripcion: producto.description,
      precio: producto.price,
      categoria_id: producto.category.id,
      activo: producto.status,
    });
  }

  cancelarEdicion(): void {
    this.editandoId.set(null);
    this.form.reset({ nombre: '', descripcion: '', precio: 0, categoria_id: 0, activo: true });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar este producto?')) return;

    this.productService.delete(id).subscribe({
      next: () => this.cargarTodo(),
      error: () => this.error.set('No se pudo eliminar el producto.'),
    });
  }

  crearCategoria(): void {
    if (this.categoriaForm.invalid) return;

    const { nombre } = this.categoriaForm.getRawValue();

    this.productService.createCategory(nombre).subscribe({
      next: () => {
        this.categoriaForm.reset({ nombre: '' });
        this.cargarTodo();
      },
      error: () => this.error.set('No se pudo crear la categoría (¿ya existe?).'),
    });
  }
}
