export const environment = {
  production: false,
  // En desarrollo, Angular CLI dev-server usa proxy.conf.json para redirigir /api a http://143.0.250.120:86/WA_RRHHBolPago
  apiBaseUrl: '',
  endpoints: {
    login: '/api/login/GetLogin',
    usuario: '/api/Cuenta/GetUsuario',
    cambiarClave: '/api/Cuenta/UpdatePwdUsuario',
    boleta: '/api/BoletaPago/UpdateBoletaPago'
  }
};
