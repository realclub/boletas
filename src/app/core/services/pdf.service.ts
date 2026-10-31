import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  /**
   * Crea una URL temporal (blob:) para previsualizar el PDF en iframe o visor
   */
  crearBlobUrl(blob: Blob): string {
    return URL.createObjectURL(blob);
  }

  /**
   * Abre el archivo PDF en una nueva pestaña del navegador
   */
  abrirEnNuevaVentana(blob: Blob): Window | null {
    const url = this.crearBlobUrl(blob);
    const win = window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    return win;
  }

  /**
   * Descarga directamente el archivo PDF
   */
  descargarBlob(blob: Blob, nombreArchivo = 'boleta_pago.pdf'): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }
}
