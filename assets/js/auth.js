const Auth = {
  login: function (email, password) {
    const loginUrl = Config.getBaseApiUrl() + '/auth/login';

    return $.ajax({
      url: loginUrl,
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({ email, password })
    })
      .done(res => {
        console.log('Login response:', res);
        if (res.access_token) {
          sessionStorage.setItem('token', res.access_token);
          sessionStorage.setItem('user', JSON.stringify(res.user));
        } else {
          throw new Error('Login sin token.');
        }
      })
      .fail(xhr => {
        console.error('Error en login:', {
          status: xhr.status,
          statusText: xhr.statusText,
          responseText: xhr.responseText,
          responseJSON: xhr.responseJSON,
          url: loginUrl
        });

        const msg =
          xhr?.responseJSON?.message ||
          xhr?.responseJSON?.error ||
          (xhr.status === 0
            ? 'No se pudo conectar con la API. Revisa CORS, SSL o bloqueo del navegador.'
            : `Error ${xhr.status}: ${xhr.statusText}`);

        throw new Error(msg);
      });
  },

  logout: function () {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = 'index.html';
  },

  getToken: function () {
    return sessionStorage.getItem('token');
  },

  getUser: function () {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: function () {
    return !!this.getToken();
  },

  attachToken: function () {
    const token = this.getToken();
    if (token) {
      $.ajaxSetup({
        headers: {
          Authorization: 'Bearer ' + token
        }
      });
    }
  },

  refreshToken: function () {
    return $.ajax({
      url: Config.getBaseApiUrl() + '/auth/refresh',
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + Auth.getToken()
      },
      dataType: 'json'
    })
      .done(res => {
        console.log('Refresh response:', res);
        if (res.access_token) {
          sessionStorage.setItem('token', res.access_token);
          return res.access_token;
        } else {
          throw new Error('No se pudo refrescar el token');
        }
      })
      .fail(xhr => {
        console.error('Error en refresh:', xhr.status, xhr.responseText);
        throw new Error('Fallo al refrescar el token');
      });
  }
};

window.Auth = Auth;
