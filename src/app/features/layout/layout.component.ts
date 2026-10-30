import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-[#131416] text-(--surface-text)">
      <!-- Top Navigation Bar -->
      <header class="sticky top-0 z-30 bg-white/90 dark:bg-[#161b27]/90 backdrop-blur-md border-b border-gray-100 dark:border-white/8 shadow-xs">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <!-- Logo & Brand -->
          <div class="flex items-center gap-3">
            <img src="/images/logos/LOGO_H_AZUL.png" alt="Real Club de Lima" class="h-9 w-auto object-contain dark:hidden" />
            <img src="/images/logos/LOGO_H_BLANCO-8.png" alt="Real Club de Lima" class="h-9 w-auto object-contain hidden dark:block" />
            <div class="hidden sm:block border-l border-gray-200 dark:border-white/10 pl-3">
              <span class="block text-xs font-semibold uppercase tracking-widest text-(--color-secondary)">Portal Colaborador</span>
              <span class="block text-sm font-bold text-(--color-primary) dark:text-white leading-tight">Boletas de Pago</span>
            </div>
          </div>

          <!-- Navigation Links -->
          <nav class="flex items-center gap-1 sm:gap-2">
            <a
              routerLink="/inicio"
              routerLinkActive="bg-(--color-primary)/10 text-(--color-primary) dark:bg-white/10 dark:text-white font-semibold"
              class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-(--color-primary) dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              <span>Inicio</span>
            </a>

            <a
              routerLink="/boletas"
              routerLinkActive="bg-(--color-primary)/10 text-(--color-primary) dark:bg-white/10 dark:text-white font-semibold"
              class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-(--color-primary) dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span>Mis Boletas</span>
            </a>

            <a
              routerLink="/cambiar-clave"
              routerLinkActive="bg-(--color-primary)/10 text-(--color-primary) dark:bg-white/10 dark:text-white font-semibold"
              class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-(--color-primary) dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
              </svg>
              <span>Seguridad</span>
            </a>
          </nav>

          <!-- User Profile & Logout -->
          <div class="flex items-center gap-3">
            @if (user(); as u) {
              <div class="hidden md:flex flex-col text-right">
                <span class="text-xs font-bold text-slate-800 dark:text-white truncate max-w-[180px]">{{ u.nomTra }}</span>
                <span class="text-[11px] text-slate-400 font-medium tracking-wide">DNI: {{ u.nroDni }}</span>
              </div>
            }

            <!-- Avatar -->
            <div class="w-9 h-9 rounded-full bg-(--color-primary) text-white font-bold text-xs flex items-center justify-center ring-2 ring-white dark:ring-white/10 shadow-xs">
              {{ initials() }}
            </div>

            <!-- Logout button -->
            <button
              (click)="logout()"
              title="Cerrar sesión"
              class="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </button>
          </div>

        </div>
      </header>

      <!-- Main Content Area -->
      <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <router-outlet />
      </main>

      <!-- Footer -->
      <footer class="border-t border-gray-100 dark:border-white/5 py-4 text-center text-xs text-slate-400">
        <p>&copy; {{ currentYear }} Real Club de Lima. Todos los derechos reservados.</p>
      </footer>
    </div>
  `
})
export class LayoutComponent {
  private readonly authService = inject(AuthService);
  
  readonly user = this.authService.currentUser;
  readonly currentYear = new Date().getFullYear();

  initials(): string {
    const name = this.user()?.nomTra || '';
    if (!name) return 'RC';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  logout(): void {
    this.authService.logout();
  }
}
