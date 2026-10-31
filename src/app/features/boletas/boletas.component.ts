import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService, BoletaService, PdfService } from '../../core/services';
import { MESES, BoletaItem } from '../../core/models';

type TabView = 'periodo' | 'historico';

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
          <p class="text-sm text-slate-500 dark:text-slate-400">Consulta, visualiza y descarga tus boletas oficiales de pago</p>
        </div>

        @if (user(); as u) {
          <div class="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-xs">
            <div class="w-8 h-8 rounded-xl bg-(--color-primary)/10 text-(--color-primary) dark:text-(--color-secondary) flex items-center justify-center font-bold text-xs">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <div class="text-left text-xs">
              <div class="font-bold text-slate-800 dark:text-white">{{ u.nombreCompleto || u.nombre }}</div>
              <div class="text-slate-400">Documento: {{ u.documento }}</div>
            </div>
          </div>
        }
      </div>

      <!-- Navigation Tabs: Consulta por Periodo vs Histórico -->
      <div class="flex items-center gap-2 border-b border-gray-200 dark:border-white/10 pb-3">
        <button
          type="button"
          (click)="cambiarTab('periodo')"
          [class.bg-(--color-primary)]="activeTab() === 'periodo'"
          [class.text-white]="activeTab() === 'periodo'"
          [class.font-bold]="activeTab() === 'periodo'"
          [class.shadow-sm]="activeTab() === 'periodo'"
          [class.text-slate-600]="activeTab() !== 'periodo'"
          [class.dark:text-slate-300]="activeTab() !== 'periodo'"
          [class.hover:bg-slate-100]="activeTab() !== 'periodo'"
          [class.dark:hover:bg-white/5]="activeTab() !== 'periodo'"
          class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm transition cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <span>Por Periodo (Año / Mes)</span>
        </button>

        <button
          type="button"
          (click)="cambiarTab('historico')"
          [class.bg-(--color-primary)]="activeTab() === 'historico'"
          [class.text-white]="activeTab() === 'historico'"
          [class.font-bold]="activeTab() === 'historico'"
          [class.shadow-sm]="activeTab() === 'historico'"
          [class.text-slate-600]="activeTab() !== 'historico'"
          [class.dark:text-slate-300]="activeTab() !== 'historico'"
          [class.hover:bg-slate-100]="activeTab() !== 'historico'"
          [class.dark:hover:bg-white/5]="activeTab() !== 'historico'"
          class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm transition cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>Histórico de Boletas Recibidas</span>
        </button>
      </div>

      <!-- TAB 1: FILTRO POR PERIODO -->
      @if (activeTab() === 'periodo') {
        <div class="rcl-card p-5 sm:p-6 shadow-sm">
          <form (ngSubmit)="consultarMes()" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </div>

            <!-- Botón Consultar -->
            <div class="flex items-center justify-end gap-3 pt-2">
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
                  <span>Consultando...</span>
                } @else {
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                  <span>Buscar Boletas</span>
                }
              </button>
            </div>
          </form>
        </div>
      }

      <!-- Mensaje de Error / Alerta -->
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

      <!-- LISTA DE BOLETAS ENCONTRADAS -->
      @if (boletasList().length > 0) {
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {{ activeTab() === 'periodo' ? 'Boletas del periodo seleccionado' : 'Histórico de Boletas Recibidas' }} ({{ boletasList().length }})
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (b of boletasList(); track b.pdf) {
              <div class="rcl-card p-5 flex flex-col justify-between hover:shadow-md transition border border-gray-100 dark:border-white/10">
                <div>
                  <!-- Header con tipo y estado -->
                  <div class="flex items-start justify-between gap-2 mb-3">
                    <span
                      [class.bg-blue-50]="b.tipo === 'N'"
                      [class.text-blue-700]="b.tipo === 'N'"
                      [class.bg-amber-50]="b.tipo === 'G'"
                      [class.text-amber-700]="b.tipo === 'G'"
                      [class.bg-emerald-50]="b.tipo === 'V'"
                      [class.text-emerald-700]="b.tipo === 'V'"
                      class="px-2.5 py-1 rounded-lg text-xs font-bold"
                    >
                      {{ b.tipoNombre }}
                    </span>

                    @if (b.recibida) {
                      <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        Recibida
                      </span>
                    } @else {
                      <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
                        <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        Pendiente
                      </span>
                    }
                  </div>

                  <!-- Periodo -->
                  <h3 class="text-base font-bold text-slate-800 dark:text-white">
                    {{ obtenerNombreMes(b.mes) }} {{ b.anio }}
                  </h3>
                  
                  @if (b.fechaRecepcion) {
                    <p class="text-[11px] text-slate-400 mt-1">
                      Leída el: {{ b.fechaRecepcion | date:'dd/MM/yyyy HH:mm' }}
                    </p>
                  }
                </div>

                <!-- Botones de Acción -->
                <div class="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center gap-2">
                  @if (b.disponible) {
                    <button
                      type="button"
                      (click)="verBoleta(b)"
                      class="rcl-btn-primary flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                      <span>Ver Boleta</span>
                    </button>

                    <button
                      type="button"
                      (click)="descargarBoleta(b)"
                      title="Descargar archivo PDF"
                      class="rcl-btn-secondary p-2 text-xs cursor-pointer"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                      </svg>
                    </button>
                  } @else {
                    <div class="w-full text-center py-2 text-xs text-slate-400 bg-slate-50 dark:bg-white/5 rounded-xl">
                      PDF no disponible
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- ESTADO VACÍO (Si consultó y no hay boletas) -->
      @if (boletasList().length === 0 && !loading() && consultaRealizada()) {
        <div class="rcl-card p-12 text-center border-dashed border-2 border-gray-200 dark:border-white/10">
          <div class="mx-auto w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-400 flex items-center justify-center mb-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <h3 class="text-base font-semibold text-slate-800 dark:text-white">No se encontraron boletas</h3>
          <p class="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            No existen boletas de pago registradas para el periodo seleccionado.
          </p>
        </div>
      }

      <!-- MODAL / VISOR DE BOLETA PDF -->
      @if (boletaSeleccionada(); as b) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div class="bg-white dark:bg-[#161b27] rounded-3xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10">
            <!-- Modal Header -->
            <div class="px-6 py-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
              <div>
                <h3 class="text-base font-bold text-slate-800 dark:text-white">
                  Boleta {{ b.tipoNombre }} &mdash; {{ obtenerNombreMes(b.mes) }} {{ b.anio }}
                </h3>
                <p class="text-xs text-emerald-600 font-medium">Recepción registrada oficialmente en planillas</p>
              </div>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  (click)="descargarBoleta(b)"
                  class="rcl-btn-primary py-1.5 px-3 text-xs"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                  <span>Descargar</span>
                </button>

                <button
                  type="button"
                  (click)="cerrarVisor()"
                  class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Modal Body: iFrame con PDF -->
            <div class="flex-1 bg-slate-100 dark:bg-black/30 relative">
              @if (cargandoPdf()) {
                <div class="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div class="w-10 h-10 border-4 border-(--color-primary) border-t-transparent rounded-full animate-spin"></div>
                  <p class="text-xs text-slate-500 font-medium">Cargando documento PDF...</p>
                </div>
              }

              @if (safePdfUrl(); as safeUrl) {
                <iframe
                  [src]="safeUrl"
                  class="w-full h-full border-0"
                  title="Visor de Boleta de Pago"
                ></iframe>
              }
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class BoletasComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly boletaService = inject(BoletaService);
  private readonly pdfService = inject(PdfService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly user = this.authService.currentUser;
  readonly meses = MESES;

  readonly activeTab = signal<TabView>('periodo');
  readonly anosDisponibles: number[] = [];
  selectedAnno = new Date().getFullYear();
  selectedMes = new Date().getMonth() + 1;

  readonly boletasList = signal<BoletaItem[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly consultaRealizada = signal(false);

  // Visor modal
  readonly boletaSeleccionada = signal<BoletaItem | null>(null);
  readonly safePdfUrl = signal<SafeResourceUrl | null>(null);
  readonly cargandoPdf = signal(false);

  constructor() {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= currentYear - 10; y--) {
      this.anosDisponibles.push(y);
    }
  }

  ngOnInit(): void {
    // Al iniciar, consultar automáticamente el mes actual
    this.consultarMes();
  }

  cambiarTab(tab: TabView): void {
    this.activeTab.set(tab);
    this.errorMessage.set(null);
    this.consultaRealizada.set(false);
    this.boletasList.set([]);

    if (tab === 'historico') {
      this.consultarHistorico();
    } else {
      this.consultarMes();
    }
  }

  obtenerNombreMes(mesNum: number): string {
    const found = MESES.find(m => m.value === mesNum);
    return found ? found.label : `Mes ${mesNum}`;
  }

  consultarMes(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.consultaRealizada.set(true);

    this.boletaService.obtenerBoletasMes(Number(this.selectedAnno), Number(this.selectedMes)).subscribe({
      next: (boletas) => {
        this.loading.set(false);
        this.boletasList.set(boletas);
        if (boletas.length === 0) {
          this.errorMessage.set('No se encontraron boletas para el periodo seleccionado.');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err?.error?.message || err?.message || 'Error al consultar boletas.');
      }
    });
  }

  consultarHistorico(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.consultaRealizada.set(true);

    this.boletaService.obtenerHistorico().subscribe({
      next: (boletas) => {
        this.loading.set(false);
        this.boletasList.set(boletas);
        if (boletas.length === 0) {
          this.errorMessage.set('Aún no tienes boletas registradas en tu histórico.');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err?.error?.message || err?.message || 'Error al obtener el histórico de boletas.');
      }
    });
  }

  verBoleta(boleta: BoletaItem): void {
    this.boletaSeleccionada.set(boleta);
    this.cargandoPdf.set(true);
    this.safePdfUrl.set(null);

    this.boletaService.obtenerPdfBlob(boleta.pdf, false).subscribe({
      next: (blob) => {
        this.cargandoPdf.set(false);
        const blobUrl = this.pdfService.crearBlobUrl(blob);
        this.safePdfUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl));
        // Marcar visualmente como recibida ya que la API registra la recepción
        boleta.recibida = true;
      },
      error: (err) => {
        this.cargandoPdf.set(false);
        this.cerrarVisor();
        this.errorMessage.set(err?.error?.message || 'No se pudo cargar el archivo PDF de la boleta.');
      }
    });
  }

  descargarBoleta(boleta: BoletaItem): void {
    this.boletaService.descargarBoleta(boleta);
    boleta.recibida = true;
  }

  cerrarVisor(): void {
    this.boletaSeleccionada.set(null);
    this.safePdfUrl.set(null);
  }
}
