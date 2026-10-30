import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services';
import { MESES } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-8">
      
      <!-- Welcome Hero Banner -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-(--color-primary) via-[#002277] to-(--color-primary-light) text-white p-7 sm:p-9 shadow-lg">
        <!-- Background subtle glow/rings -->
        <div class="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/5 pointer-events-none blur-2xl"></div>
        <div class="absolute right-20 top-0 w-32 h-32 rounded-full bg-(--color-secondary)/20 pointer-events-none blur-xl"></div>
        
        <div class="relative z-10 max-w-2xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-(--color-secondary-light) mb-3">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Sistema de Recursos Humanos</span>
          </div>

          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            ¡Hola, {{ primerNombre() }}!
          </h1>
          <p class="mt-2 text-sm sm:text-base text-blue-100/90 leading-relaxed font-light">
            Bienvenido a tu portal oficial de autoservicio para consulta y descarga de boletas de pago del Real Club de Lima.
          </p>

          <div class="mt-6 flex flex-wrap items-center gap-3">
            <a
              routerLink="/boletas"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-(--color-secondary) hover:bg-(--color-secondary-light) text-slate-900 font-bold text-xs sm:text-sm shadow-md transition transform active:scale-95"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span>Consultar Boletas</span>
            </a>

            <a
              routerLink="/cambiar-clave"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm border border-white/20 transition"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
              </svg>
              <span>Seguridad</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Quick Action Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        <!-- Card 1: Consultar Boletas -->
        <div class="rcl-card p-6 flex flex-col justify-between hover:border-(--color-primary)/30 dark:hover:border-white/20 transition group">
          <div>
            <div class="w-11 h-11 rounded-2xl bg-sky-50 dark:bg-white/5 text-(--color-primary) dark:text-(--color-secondary) flex items-center justify-center mb-4 group-hover:scale-105 transition">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <h3 class="text-base font-bold text-slate-800 dark:text-white">Mis Boletas de Pago</h3>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Consulta tus boletas mensuales, vacaciones y gratificaciones con visor digital y descarga PDF oficial.
            </p>
          </div>
          <div class="mt-5 pt-4 border-t border-gray-100 dark:border-white/5">
            <a routerLink="/boletas" class="inline-flex items-center gap-1.5 text-xs font-bold text-(--color-primary) dark:text-(--color-secondary) hover:underline">
              <span>Ir a mis boletas</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Card 2: Periodo Actual -->
        <div class="rcl-card p-6 flex flex-col justify-between hover:border-(--color-primary)/30 dark:hover:border-white/20 transition group">
          <div>
            <div class="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 class="text-base font-bold text-slate-800 dark:text-white">Periodo en Curso</h3>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Periodo activo: <strong>{{ mesActualNombre() }} {{ anoActual }}</strong>. Revisa tus registros emitidos a la fecha.
            </p>
          </div>
          <div class="mt-5 pt-4 border-t border-gray-100 dark:border-white/5">
            <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Emisión al día</span>
            </span>
          </div>
        </div>

        <!-- Card 3: Seguridad y Credenciales -->
        <div class="rcl-card p-6 flex flex-col justify-between hover:border-(--color-primary)/30 dark:hover:border-white/20 transition group">
          <div>
            <div class="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <h3 class="text-base font-bold text-slate-800 dark:text-white">Seguridad de la Cuenta</h3>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Mantén tu contraseña actualizada periódicamente para proteger tu información laboral y salarial.
            </p>
          </div>
          <div class="mt-5 pt-4 border-t border-gray-100 dark:border-white/5">
            <a routerLink="/cambiar-clave" class="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline">
              <span>Cambiar clave</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>

      </div>

      <!-- Info Banner / Support -->
      <div class="rcl-card p-5 sm:p-6 bg-slate-50/50 dark:bg-white/3 border border-gray-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-gray-200/80 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-800 dark:text-white">¿Tienes consultas sobre tu boleta de pago?</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400">Comunícate con la Gerencia de Gestión Humana y Recursos Humanos del Real Club de Lima.</p>
          </div>
        </div>
        <div class="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-white/5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 w-fit shrink-0">
          Oficina de RRHH &bull; Anexo 120 / 125
        </div>
      </div>

    </div>
  `
})
export class DashboardComponent {
  private readonly authService = inject(AuthService);

  readonly user = this.authService.currentUser;
  readonly anoActual = new Date().getFullYear();
  readonly mesActual = new Date().getMonth() + 1;

  primerNombre(): string {
    const full = this.user()?.nomTra || '';
    if (!full) return 'Colaborador';
    return full.split(' ')[0];
  }

  mesActualNombre(): string {
    const found = MESES.find(m => m.value === this.mesActual);
    return found ? found.label : '';
  }
}
