// // assets/js/main.js

// (function () {
//   const ERP = {
//     /**
//      * Retorna el path base del proyecto dinámicamente, sin /
//      * Ej: si estás en /conectotal_web/home.html → /conectotal_web
//      */
//     getBasePath: function () {
//       const parts = window.location.pathname.split('/');
//       parts.pop(); // quita el archivo actual (home.html)
//       return parts.join('/') || '/';
//     },

//     /**
//      * Retorna la ruta completa de home.html con un módulo dado
//      */
//     getModuloUrl: function (modulo) {
//       return `${this.getBasePath()}/home.html?modulo=${modulo}`;
//     },

//     /**
//      * Inicializa el menú lateral con rutas dinámicas
//      */
//     initDynamicSidebar: function () {
//       const basePath = this.getBasePath();
//       $('[data-modulo]').each(function () {
//         const modulo = $(this).data('modulo');
//         $(this).attr('href', `${basePath}/home.html?modulo=${modulo}`);
//       });
//     },

//     /**
//      * Inicializador general (puedes agregar más hooks aquí)
//      */
//     init: function () {
//       this.initDynamicSidebar();
//       console.log('ERP iniciado con basePath:', this.getBasePath());
//     }
//   };

//   // Exponemos globalmente si lo necesitas en otros scripts
//   window.ERP = ERP;

//   // Ejecutamos automáticamente al cargar
//   $(document).ready(() => ERP.init());
// })();


// assets/js/main.js

// assets/js/main.js

(function () {
  const ERP = {
    getBasePath: function () {
      const parts = window.location.pathname.split('/');
      parts.pop();
      return parts.join('/') || '/';
    },

    getModuloUrl: function (modulo) {
      return `${this.getBasePath()}/home.html?modulo=${modulo}`;
    },

    initDynamicSidebar: function () {
      const basePath = this.getBasePath();
      $('[data-modulo]').each(function () {
        const modulo = $(this).data('modulo');
        $(this).attr('href', `${basePath}/home.html?modulo=${modulo}`);
      });
    },

    // Hook: se ejecuta cuando un módulo fue cargado
    onModuloCargado: function (modulo) {
      if (modulo === 'facturas') {
        console.log('[Hook] Inicializando lógica de facturas...');
        if (typeof ERP.initFacturas === 'function') ERP.initFacturas();
      }

      if (modulo === 'cotizaciones') {
        console.log('[Hook] Inicializando lógica de cotizaciones...');
        if (typeof ERP.initCotizaciones === 'function') ERP.initCotizaciones();
      }

      // Puedes seguir agregando aquí tus módulos
    },

    init: function () {
      this.initDynamicSidebar();
    }
  };

  window.ERP = ERP;
  $(document).ready(() => ERP.init());
})();

