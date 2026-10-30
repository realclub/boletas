export const environment = {
  production: true,
  apiBaseUrl: 'http://143.0.250.120:86/WA_RRHHBolPago',
  endpoints: {
    login: '/api/login/GetLogin',
    usuario: '/api/Cuenta/GetUsuario',
    cambiarClave: '/api/Cuenta/UpdatePwdUsuario',
    boleta: '/api/BoletaPago/UpdateBoletaPago'
  }
};
