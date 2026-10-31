import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-sky-50/20 to-slate-100 dark:from-[#111317] dark:via-[#161b27] dark:to-[#0f1013]">
      <div class="w-full max-w-md">
        
        <!-- Brand Header -->
        <div class="text-center mb-8">
          <img src="/images/logos/LOGO_H_AZUL.png" alt="Real Club de Lima" class="h-14 w-auto mx-auto object-contain dark:hidden" />
          <img src="/images/logos/LOGO_H_BLANCO-8.png" alt="Real Club de Lima" class="h-14 w-auto mx-auto object-contain hidden dark:block" />
          <p class="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-(--color-secondary)">Portal de Colaboradores</p>
          <h1 class="mt-1 text-2xl font-bold tracking-tight text-(--color-primary) dark:text-white">Boletas de Pago</h1>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Ingresa tus credenciales para consultar tus boletas</p>
        </div>

        <!-- Login Card -->
        <div class="rcl-card p-7 sm:p-8 shadow-xl border border-gray-100/80 dark:border-white/10 backdrop-blur-sm">
          
          @if (errorMessage(); as error) {
            <div class="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs sm:text-sm flex items-start gap-3">
              <svg class="w-5 h-5 shrink-0 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>{{ error }}</span>
            </div>
          }

          <form (ngSubmit)="onSubmit()" class="space-y-4">
            <!-- Documento -->
            <div>
              <label for="documento" class="rcl-label">Nro. de Documento</label>
              <div class="relative">
                <input
                  id="documento"
                  name="documento"
                  type="text"
                  [(ngModel)]="documento"
                  required
                  placeholder="DNI, carné de extranjería o pasaporte"
                  class="rcl-input pl-10"
                  [disabled]="loading()"
                />
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </span>
              </div>
            </div>

            <!-- Contraseña -->
            <div>
              <label for="password" class="rcl-label">Contraseña</label>
              <div class="relative">
                <input
                  id="password"
                  name="password"
                  [type]="showPassword() ? 'text' : 'password'"
                  [(ngModel)]="password"
                  required
                  placeholder="••••••••"
                  class="rcl-input pl-10 pr-10"
                  [disabled]="loading()"
                />
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </span>
                <button
                  type="button"
                  (click)="showPassword.set(!showPassword())"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                >
                  @if (showPassword()) {
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/>
                    </svg>
                  } @else {
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  }
                </button>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="pt-2">
              <button
                type="submit"
                [disabled]="loading() || !documento.trim() || !password.trim()"
                class="rcl-btn-primary w-full py-3 text-sm font-semibold tracking-wide shadow-md"
              >
                @if (loading()) {
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Iniciando sesión...</span>
                } @else {
                  <span>Ingresar a mi portal</span>
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                  </svg>
                }
              </button>
            </div>
          </form>

        </div>

        <!-- Help Info -->
        <p class="mt-6 text-center text-xs text-slate-400">
          ¿Problemas para acceder? Contacta a la Oficina de Recursos Humanos.
        </p>

      </div>
    </div>
  `
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  documento = '';
  password = '';
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly showPassword = signal(false);

  onSubmit(): void {
    if (!this.documento.trim() || !this.password.trim()) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.login({
      documento: this.documento.trim(),
      clave: this.password.trim()
    }).subscribe({
      next: (session) => {
        this.loading.set(false);
        this.router.navigate(['/inicio']).then(navigated => {
          if (!navigated) {
            window.location.href = '/inicio';
          }
        }).catch(() => {
          window.location.href = '/inicio';
        });
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err?.message || 'Error al iniciar sesión. Verifique su documento y contraseña.');
      }
    });
  }
}
