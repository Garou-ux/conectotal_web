const Config = {
  getBaseApiUrl: function () {
    const hostname = window.location.hostname;

    if (hostname === '127.0.0.1' || hostname === 'localhost') {
      return 'http://127.0.0.1:8000/api';
    }

    return 'https://api.simecproyectos.net/api';
  }
};
