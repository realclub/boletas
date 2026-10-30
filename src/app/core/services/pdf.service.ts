import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  /**
   * Convierte una cadena base64 en un Blob de tipo PDF
   */
  base64ToBlob(base64: string, mimeType = 'application/pdf'): Blob {
    const cleanBase64 = base64.replace(/^data:application\/pdf;base64,/, '');
    const byteCharacters = atob(cleanBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  /**
   * Crea una URL temporal (blob:) para previsualizar el PDF en iframe o visor
   */
  crearBlobUrl(base64: string): string {
    const blob = this.base64ToBlob(base64);
    return URL.createObjectURL(blob);
  }

  /**
   * Abre el PDF en una nueva pestaña del navegador
   */
  abrirEnNuevaVentana(base64: string): Window | null {
    const url = this.crearBlobUrl(base64);
    return window.open(url, '_blank');
  }

  /**
   * Descarga directamente el archivo PDF con el nombre especificado
   */
  descargarPdf(base64: string, nombreArchivo = 'boleta_pago.pdf'): void {
    const blob = this.base64ToBlob(base64);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
