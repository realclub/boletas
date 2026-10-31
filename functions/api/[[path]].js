/**
 * Cloudflare Pages Function - Proxy hacia la Web API NavaSoft
 * Intercepta cualquier petición a /api/* en boletas.realclubdelima.org.pe
 */

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Manejar preflight CORS (OPTIONS)
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // URL destino en el servidor NavaSoft (puerto 86)
  // url.pathname contiene por ejemplo: /api/login/GetLogin
  const targetUrl = `http://143.0.250.120:86/WA_RRHHBolPago${url.pathname}${url.search}`;

  // Clonar y ajustar cabeceras para la petición saliente
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');

  const auth = request.headers.get('Authorization');
  if (auth) {
    headers.set('Authorization', auth);
  }

  try {
    let body = undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      body = await request.text();
    }

    // Realizar la petición desde el Edge de Cloudflare a NavaSoft
    const apiResponse = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: body,
    });

    const responseBody = await apiResponse.text();

    return new Response(responseBody, {
      status: apiResponse.status,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error al conectar con el servidor central NavaSoft: ' + error.message,
      }),
      {
        status: 502,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

