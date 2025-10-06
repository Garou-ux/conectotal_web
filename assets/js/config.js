const Config = {
  getBaseApiUrl: function () {
    const hostname = window.location.hostname;
    console.log(hostname);
    // Ambiente local (desarrollo)
    if (hostname === '127.0.0.1' || hostname === 'localhost') {
      console.log('aaa')
      return 'http://127.0.0.1:8000/api';
    } 
    console.log('uwu')
    // Ambiente producción
    return 'https://api.simecproyectos.net/api';
  }
};
