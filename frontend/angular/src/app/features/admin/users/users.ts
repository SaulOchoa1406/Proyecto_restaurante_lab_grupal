import { Component, inject, model } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../../core/services/users';

@Component({
  selector: 'app-users',
  imports: [ReactiveFormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  private readonly fb = inject(FormBuilder);
  private readonly usersServices = inject(UsersService);

  loading = false;
  error = '';
  success = '';

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    rol: ['MOZO' as 'MOZO' | 'COCINERO',  Validators.required],
  });

  createUser(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.usersServices.create(this.form.getRawValue()).subscribe({
      next: () => {
        this.success = 'Usuario creado correctamente',
        this.form.reset({ rol: 'MOZO' });
        this.loading = false;
      },

      error: () => {
        this.error = 'No se pudo crear el usuario',
        this.loading = false;
      },
    });
  }
}
