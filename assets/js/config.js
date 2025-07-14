// assets/js/config.js
const Config = {
  getBaseApiUrl: function () {
    const hostname = window.location.hostname;

    // Puedes ajustar por dominio o puerto
    if (hostname === '127.0.0.1' || hostname === 'localhost') {
      return 'http://127.0.0.1:8000/api';
    } else {
      return 'https://api.conectotal.com/api'; // cambia esto por tu dominio real de producción
    }
  }
};
