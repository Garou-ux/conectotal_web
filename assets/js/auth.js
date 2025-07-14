const Auth = {
  login: function (email, password) {
    return $.ajax({
      url: Config.getBaseApiUrl() + '/auth/login',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ email, password })
    }).then(res => {
      if (res.access_token) {
        sessionStorage.setItem('token', res.access_token);
        sessionStorage.setItem('user', JSON.stringify(res.user));
        return res;
      } else {
        throw new Error('Login sin token.');
      }
    });
  },

  logout: function () {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = 'index.html'; // redirigir al login
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
        }
    }).then(res => {
        if (res.access_token) {
        sessionStorage.setItem('token', res.access_token);
        return res.access_token;
        } else {
        throw new Error('No se pudo refrescar el token');
        }
    });
  },

};

window.Auth = Auth;
