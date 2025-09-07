const Api = {

  get: function (path, options = {}) {
    return this._request('GET', path, null, options);
  },

  post: function (path, data, options = {}) {
    return this._request('POST', path, data, options);
  },

  put: function (path, data, options = {}) {
    return this._request('PUT', path, data, options);
  },

  delete: function (path, data = {}, options = {}) {
    return this._request('DELETE', path, data, options);
  },

//   _request: function (method, path, data = null, options = {}) {
//     const token = Auth.getToken();
//     const headers = {
//       'Content-Type': 'application/json',
//       ...options.headers,
//     };

//     if (token) {
//       headers['Authorization'] = 'Bearer ' + token;
//     }

//     return $.ajax({
//       url: Config.getBaseApiUrl() + path,
//       method,
//       headers,
//       data: data ? JSON.stringify(data) : undefined
//     }).catch(xhr => {
//       // Centralizado: log, alert o redirección si 401
//       if (xhr.status === 401) {
//         alert('Sesión expirada. Inicia sesión de nuevo.');
//         Auth.logout(); // limpia y redirige
//       }

//       throw xhr; // para que el .catch() de quien lo llame lo maneje también
//     });
//   }

_request: function (method, path, data = null, options = {}) {
  const makeRequest = (token) => {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'applicacion/json',
      ...options.headers,
      Authorization: 'Bearer ' + token
    };

    return $.ajax({
      url: Config.getBaseApiUrl() + path,
      method,
      headers,
      data: data ? JSON.stringify(data) : undefined
    });
  };

  const originalToken = Auth.getToken();
  return makeRequest(originalToken).catch(err => {
    if (err.status === 401 && !options._retry) {
      // Intentar refrescar solo una vez
      return Auth.refreshToken().then(newToken => {
        options._retry = true;
        return makeRequest(newToken);
      }).catch(() => {
        Auth.logout();
        throw err;
      });
    }

    throw err;
  });
}

};

window.Api = Api;

