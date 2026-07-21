import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    RouterModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;

  error = '';

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  login() {
    if (this.form.invalid) return;

    this.loading = true;
    const username = this.form.value.username!;
    const password = this.form.value.password!;

    this.auth.login(username, password).subscribe({
      next: () => {
        this.auth.getCurrentUser().subscribe({
          next: (user) => {
            switch (user.rol) {
              case "MOZO":
                this.router.navigate(['/waiter']);
                break;
              
              case "ADMINISTRADOR":
                this.router.navigate(['/admin']);
                break;
              
              case "COCINERO":
                this.router.navigate(['/kitchen']);
                break;
            }
          }
        });
      },

      error: () => {
        this.loading = false;
        this.error = "Usuario o contraseña incorrectos";
      }

    });
  }

}
