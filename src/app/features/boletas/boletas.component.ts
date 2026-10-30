import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService, BoletaService, PdfService } from '../../core/services';
import { MESES, TIPOS_PLANILLA, TipoPlanilla, BoletaRequest } from '../../core/models';

@Component({
  selector: 'app-boletas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      
      <!-- Page Header & Greeting -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span class="text-xs font-semibold uppercase tracking-wider text-(--color-secondary)">Consulta en línea</span>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Boletas de Pago</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">Selecciona el periodo y tipo de boleta que deseas consultar o descargar</p>
        </div>

        @if (user(); as u) {
          <div class="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-xs">
            <div class="w-8 h-8 rounded-xl bg-(--color-primary)/10 text-(--color-primary) dark:text-(--color-secondary) flex items-center justify-center font-bold text-xs">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <div class="text-left text-xs">
              <div class="font-bold text-slate-800 dark:text-white">{{ u.nomTra }}</div>
              <div class="text-slate-400">DNI: {{ u.nroDni }} &bull; Código: {{ u.codTra }}</div>
            </div>
          </div>
        }
      </div>

      <!-- Filter Controls Card -->
      <div class="rcl-card p-5 sm:p-6 shadow-sm">
        <form (ngSubmit)="consultar()" class="space-y-5">
          
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <!-- Año -->
            <div>
              <label for="selectAnno" class="rcl-label">Año</label>
              <select
                id="selectAnno"
                [(ngModel)]="selectedAnno"
                name="selectedAnno"
                class="rcl-select"
                [disabled]="loading()"
              >
                @for (anno of anosDisponibles; track anno) {
                  <option [value]="anno">{{ anno }}</option>
                }
              </select>
            </div>

            <!-- Mes -->
            <div>
              <label for="selectMes" class="rcl-label">Mes</label>
              <select
                id="selectMes"
                [(ngModel)]="selectedMes"
                name="selectedMes"
                class="rcl-select"
                [disabled]="loading()"
              >
                @for (m of meses; track m.value) {
                  <option [value]="m.value">{{ m.label }}</option>
                }
              </select>
            </div>

            <!-- Tipo de Planilla -->
            <div>
              <label class="rcl-label">Tipo de Boleta</label>
              <div class="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-white/5 rounded-xl border border-gray-200/50 dark:border-white/5">
                @for (t of tiposPlanilla; track t.value) {
                  <button
                    type="button"
                    (click)="selectedTipo.set(t.value)"
                    [class.bg-white]="selectedTipo() === t.value"
                    [class.dark:bg-[#1a2033]]="selectedTipo() === t.value"
                    [class.text-(--color-primary)]="selectedTipo() === t.value"
                    [class.dark:text-white]="selectedTipo() === t.value"
                    [class.shadow-xs]="selectedTipo() === t.value"
                    [class.font-bold]="selectedTipo() === t.value"
                    [class.text-slate-500]="selectedTipo() !== t.value"
                    class="py-1.5 px-2 text-xs rounded-lg transition text-center truncate cursor-pointer"
                  >
                    {{ t.label }}
                  </button>
                }
              </div>
            </div>

          </div>

          <!-- Buttons -->
          <div class="flex items-center justify-end gap-3 pt-2 border-t border-gray-100 dark:border-white/5">
            @if (pdfBase64()) {
              <button
                type="button"
                (click)="limpiar()"
                class="rcl-btn-secondary"
                [disabled]="loading()"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <span>Limpiar</span>
              </button>
            }

            <button
              type="submit"
              [disabled]="loading()"
              class="rcl-btn-primary"
            >
              @if (loading()) {
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Buscando boleta...</span>
              } @else {
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <span>Consultar Boleta</span>
              }
            </button>
          </div>

        </form>
      </div>

      <!-- Error Alert -->
      @if (errorMessage(); as msg) {
        <div class="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-200 text-sm flex items-start gap-3">
          <svg class="w-5 h-5 shrink-0 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <div>
            <p class="font-bold">Información</p>
            <p class="mt-0.5 text-xs sm:text-sm">{{ msg }}</p>
          </div>
        </div>
      }

      <!-- Boleta Found / Preview Section -->
      @if (pdfBase64(); as pdf) {
        <div class="rcl-card p-5 sm:p-6 shadow-md space-y-4">
          
          <!-- Boleta Header Status -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100 dark:border-white/5">
            <div class="flex items-center gap-3">
              <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </span>
              <div>
                <h3 class="text-base font-bold text-slate-800 dark:text-white">
                  Boleta {{ tipoNombre() }} &mdash; {{ mesNombre() }} {{ selectedAnno }}
                </h3>
                <p class="text-xs text-slate-500">Documento generado exitosamente</p>
              </div>
            </div>

            <!-- Actions: Download & Open -->
            <div class="flex items-center gap-2">
              <button
                type="button"
                (click)="descargar()"
                class="rcl-btn-primary py-2 px-4 text-xs font-semibold"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                <span>Descargar PDF</span>
              </button>

              <button
                type="button"
                (click)="abrirNuevaVentana()"
                class="rcl-btn-secondary py-2 px-3 text-xs"
                title="Abrir en pantalla completa"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
                <span class="hidden sm:inline">Nueva pestaña</span>
              </button>
            </div>
          </div>

          <!-- Embedded PDF Viewer -->
          @if (safePdfUrl(); as safeUrl) {
            <div class="w-full rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-slate-100 dark:bg-black/20 shadow-inner">
              <iframe
                [src]="safeUrl"
                class="w-full h-[650px] border-0"
                title="Visualizador de Boleta de Pago"
              ></iframe>
            </div>
          }

        </div>
      }

      <!-- Empty State before search -->
      @if (!pdfBase64() && !loading() && !errorMessage()) {
        <div class="rcl-card p-12 text-center border-dashed border-2 border-gray-200 dark:border-white/10">
          <div class="mx-auto w-12 h-12 rounded-2xl bg-sky-50 dark:bg-white/5 text-(--color-primary) dark:text-(--color-secondary) flex items-center justify-center mb-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <h3 class="text-base font-semibold text-slate-800 dark:text-white">Selecciona un periodo</h3>
          <p class="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Elige el año, mes y tipo de boleta en el panel superior y presiona <strong>Consultar Boleta</strong> para ver o descargar tu documento oficial.
          </p>
        </div>
      }

    </div>
  `
})
export class BoletasComponent {
  private readonly authService = inject(AuthService);
  private readonly boletaService = inject(BoletaService);
  private readonly pdfService = inject(PdfService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly user = this.authService.currentUser;
  readonly meses = MESES;
  readonly tiposPlanilla = TIPOS_PLANILLA;

  // Filtros
  readonly anosDisponibles: number[] = [];
  selectedAnno = new Date().getFullYear();
  selectedMes = new Date().getMonth() + 1;
  readonly selectedTipo = signal<TipoPlanilla>('N');

  // Estado
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly pdfBase64 = signal<string | null>(null);
  readonly safePdfUrl = signal<SafeResourceUrl | null>(null);

  constructor() {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= currentYear - 10; y--) {
      this.anosDisponibles.push(y);
    }
  }

  tipoNombre(): string {
    const found = TIPOS_PLANILLA.find(t => t.value === this.selectedTipo());
    return found ? found.label : 'Mensual';
  }

  mesNombre(): string {
    const found = MESES.find(m => m.value === Number(this.selectedMes));
    return found ? found.label : '';
  }

  consultar(): void {
    const usuario = this.user();
    if (!usuario) {
      this.errorMessage.set('Sesión no válida. Por favor vuelva a iniciar sesión.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    this.pdfBase64.set(null);
    this.safePdfUrl.set(null);

    const request: BoletaRequest = {
      NroDni: usuario.nroDni,
      CodTra: usuario.codTra,
      NomTra: usuario.nomTra,
      Anno: Number(this.selectedAnno),
      Mes: Number(this.selectedMes),
      TipPla: this.selectedTipo(),
      NameHost: typeof window !== 'undefined' ? window.location.hostname : 'localhost'
    };

    this.boletaService.consultarBoleta(request).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success && res.data) {
          this.pdfBase64.set(res.data);
          const blobUrl = this.pdfService.crearBlobUrl(res.data);
          this.safePdfUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl));
        } else {
          this.errorMessage.set(res.message || 'No se encontró boleta de pago para el periodo seleccionado.');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err?.message || 'Ocurrió un error al consultar la boleta. Intente nuevamente.');
      }
    });
  }

  descargar(): void {
    const base64 = this.pdfBase64();
    if (!base64) return;
    const filename = `boleta_${this.selectedAnno}_${this.selectedMes}_${this.selectedTipo()}.pdf`;
    this.pdfService.descargarPdf(base64, filename);
  }

  abrirNuevaVentana(): void {
    const base64 = this.pdfBase64();
    if (!base64) return;
    this.pdfService.abrirEnNuevaVentana(base64);
  }

  limpiar(): void {
    this.pdfBase64.set(null);
    this.safePdfUrl.set(null);
    this.errorMessage.set(null);
  }
}
