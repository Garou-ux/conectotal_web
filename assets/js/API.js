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

