export const environment = {
  production: true,
  // Si la app está alojada en el mismo servidor web (cPanel / Apache): usar '' (ruta relativa /api/...)
  // Si la app está en Vercel/Netlify u otro dominio: cambiar por la URL del servidor PHP (ej. 'https://tudominio.com/boletapago')
  apiBaseUrl: '',
  endpoints: {
    login: '/api/login/GetLogin',
    usuario: '/api/Cuenta/GetUsuario',
    cambiarClave: '/api/Cuenta/UpdatePwdUsuario',
    boleta: '/api/BoletaPago/UpdateBoletaPago'
  }
};
