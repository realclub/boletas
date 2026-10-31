import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, CuentaService } from '../../core/services';

@Component({
  selector: 'app-cambio-clave',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-xl mx-auto space-y-6">
      
      <!-- Page Header -->
      <div>
        <span class="text-xs font-semibold uppercase tracking-wider text-(--color-secondary)">Seguridad de la cuenta</span>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Cambiar Contraseña</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Actualiza tu clave de acceso para mayor seguridad</p>
      </div>

      <!-- Recommendation Notice -->
      <div class="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40 text-xs sm:text-sm text-sky-900 dark:text-sky-200 flex items-start gap-3">
        <svg class="w-5 h-5 shrink-0 text-(--color-primary) dark:text-(--color-secondary) mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <div class="space-y-1">
          <p class="font-bold">Reglas de la contraseña nueva:</p>
          <ul class="list-disc list-inside text-xs space-y-0.5 text-slate-600 dark:text-slate-300">
            <li>Entre <strong>6 y 10 caracteres</strong>.</li>
            <li>Solo letras sin tilde, números y signos (sin espacios, sin ñ ni tildes).</li>
            <li>Distinta de la actual y distinta del número de documento.</li>
          </ul>
        </div>
      </div>

      <!-- Card Form -->
      <div class="rcl-card p-6 sm:p-7 shadow-sm">
        
        <!-- Success Alert -->
        @if (successMessage(); as sMsg) {
          <div class="mb-5 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3">
            <svg class="w-5 h-5 shrink-0 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span>{{ sMsg }}</span>
          </div>
        }

        <!-- Error Alert -->
        @if (errorMessage(); as eMsg) {
          <div class="mb-5 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-sm flex items-center gap-3">
            <svg class="w-5 h-5 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>{{ eMsg }}</span>
          </div>
        }

        <form (ngSubmit)="onSubmit()" class="space-y-4">
          
          <!-- Contraseña Actual -->
          <div>
            <label for="currentPass" class="rcl-label">Contraseña actual</label>
            <div class="relative">
              <input
                id="currentPass"
                name="currentPass"
                [type]="showPass() ? 'text' : 'password'"
                [(ngModel)]="currentPassword"
                required
                placeholder="Ingresa tu contraseña actual"
                class="rcl-input pr-10"
                [disabled]="loading()"
              />
              <button
                type="button"
                (click)="showPass.set(!showPass())"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                @if (showPass()) {
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

          <!-- Nueva Contraseña -->
          <div>
            <label for="newPass" class="rcl-label">Nueva contraseña</label>
            <div class="relative">
              <input
                id="newPass"
                name="newPass"
                [type]="showPass() ? 'text' : 'password'"
                [(ngModel)]="newPassword"
                required
                minlength="6"
                maxlength="10"
                placeholder="Entre 6 y 10 caracteres"
                class="rcl-input pr-10"
                [disabled]="loading()"
              />
            </div>
          </div>

          <!-- Confirmar Contraseña -->
          <div>
            <label for="confirmPass" class="rcl-label">Confirmar nueva contraseña</label>
            <div class="relative">
              <input
                id="confirmPass"
                name="confirmPass"
                [type]="showPass() ? 'text' : 'password'"
                [(ngModel)]="confirmPassword"
                required
                minlength="6"
                maxlength="10"
                placeholder="Repite la nueva contraseña"
                class="rcl-input pr-10"
                [disabled]="loading()"
              />
            </div>
            @if (confirmPassword && newPassword !== confirmPassword) {
              <p class="mt-1 text-xs text-red-500">Las contraseñas no coinciden.</p>
            }
          </div>

          <!-- Submit Button -->
          <div class="pt-3">
            <button
              type="submit"
              [disabled]="loading() || !esValido()"
              class="rcl-btn-primary w-full py-2.5"
            >
              @if (loading()) {
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Actualizando contraseña...</span>
              } @else {
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                </svg>
                <span>Guardar nueva contraseña</span>
              }
            </button>
          </div>

        </form>

      </div>

    </div>
  `
})
export class CambioClaveComponent {
  private readonly authService = inject(AuthService);
  private readonly cuentaService = inject(CuentaService);

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly showPass = signal(false);

  esValido(): boolean {
    const user = this.authService.currentUser();
    const doc = user?.documento || '';

    return (
      this.currentPassword.length > 0 &&
      this.newPassword.length >= 6 &&
      this.newPassword.length <= 10 &&
      this.newPassword === this.confirmPassword &&
      this.newPassword !== this.currentPassword &&
      this.newPassword !== doc
    );
  }

  onSubmit(): void {
    if (!this.esValido()) return;

    this.loading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.cuentaService.cambiarClave({
      claveActual: this.currentPassword,
      claveNueva: this.newPassword
    }).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success) {
          this.successMessage.set(res.message || 'Contraseña actualizada correctamente.');
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
        } else {
          this.errorMessage.set(res.message || 'No se pudo actualizar la contraseña.');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err?.error?.message || err?.message || 'Error al actualizar la contraseña.');
      }
    });
  }
}
