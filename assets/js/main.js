(function () {
  const ERP = {
    /**
     * Devuelve siempre el dominio base
     * Ejemplo: https://simecproyectos.net
     */
    getBasePath: function () {
      return window.location.origin;
    },

    /**
     * Detecta el entorno actual (producción o local)
     * y devuelve el path correcto a la carpeta de módulos
     */
    getBaseModulesPath: function () {
      const origin = window.location.origin;
      const pathname = window.location.pathname;

      // Si en local está dentro de /conectotal_web/
      if (pathname.includes('/conectotal_web/')) {
        return `${origin}/conectotal_web/modules`;
      }

      // En producción (simecproyectos.net) o si está en raíz
      return `${origin}/modules`;
    },

    /**
     * Construye la URL absoluta hacia un módulo
     * Detecta automáticamente si está dentro de una subcarpeta (como /conectotal_web/)
     * Ejemplo: http://localhost:82/conectotal_web/home.html?modulo=empleados
     */
    getModuloUrl: function (modulo, id = null) {
      const origin = window.location.origin;
      const pathname = window.location.pathname;

      // Detectar si el sistema está dentro de una subcarpeta (como /conectotal_web/)
      let basePath = '';
      const match = pathname.match(/^(\/[^/]+)\//);
      if (match && match[1] !== '/home.html') {
        basePath = match[1];
      }

      const url = new URL(`${origin}${basePath}/home.html`);
      url.searchParams.set('modulo', modulo);
      if (id !== null) url.searchParams.set('id', id);
      return url.toString();
    },

    /**
     * Reemplaza los href de los enlaces con data-modulo
     * para que apunten correctamente a home.html con el querystring
     */
    initDynamicSidebar: function () {
      $('[data-modulo]').each(function () {
        const modulo = $(this).data('modulo');
        $(this).attr('href', ERP.getModuloUrl(modulo));
      });
    },

    /**
     * Carga el módulo actual según la URL
     * Busca el .html y su .js en la carpeta /modules
     */
    cargarModuloActual: function () {
      const params = new URLSearchParams(window.location.search);
      const modulo = params.get('modulo') || 'dashboard';
      const id = params.get('id') || null;

      // Usa la ruta dinámica que detecta el entorno
      const baseModulesPath = this.getBaseModulesPath();
      const rutaHtml = `${baseModulesPath}/${modulo}.html`;
      const rutaJs = `${baseModulesPath}/${modulo}.js`;

      console.log(`📦 Cargando módulo: ${modulo}`);
      console.log(`→ HTML: ${rutaHtml}`);
      console.log(`→ JS: ${rutaJs}`);

      $('#contenido').load(rutaHtml, function (response, status) {
        if (status === 'error') {
          $('#contenido').html(
            '<div class="alert alert-danger">Módulo no encontrado.</div>'
          );
        } else {
          $.getScript(rutaJs)
            .done(() => {
              console.log(`✅ ${modulo}.js cargado correctamente`);
              if (typeof ERP.onModuloCargado === 'function') {
                ERP.onModuloCargado(modulo, id);
              }
            })
            .fail(() => {
              console.warn(`⚠️ ${modulo}.js no encontrado`);
              if (typeof ERP.onModuloCargado === 'function') {
                ERP.onModuloCargado(modulo, id);
              }
            });
        }
      });
    },

    /**
     * Hook que se dispara cuando un módulo termina de cargar
     */
    onModuloCargado: function (modulo, id) {
      console.log(`[Hook] Módulo cargado: ${modulo}`, { id });

      // Hooks específicos por módulo
      if (modulo === 'facturas' && typeof ERP.initFacturas === 'function') {
        ERP.initFacturas();
      }
      if (modulo === 'cotizaciones' && typeof ERP.initCotizaciones === 'function') {
        ERP.initCotizaciones();
      }
    },

    /**
     * Cambia de módulo dinámicamente y actualiza la URL
     */
    navegarAModulo: function (modulo, id = null) {
      const origin = window.location.origin;
      const pathname = window.location.pathname;

      // Detectar si el sistema está dentro de una subcarpeta
      let basePath = '';
      const match = pathname.match(/^(\/[^/]+)\//);
      if (match && match[1] !== '/home.html') {
        basePath = match[1];
      }

      const url = new URL(`${origin}${basePath}/home.html`);
      url.searchParams.set('modulo', modulo);
      if (id !== null) url.searchParams.set('id', id);

      window.history.pushState({}, '', url);
      this.cargarModuloActual();
    },

    /**
     * Inicializa el ERP
     */
    init: function () {
      this.initDynamicSidebar();
      this.cargarModuloActual();

      // Manejo de navegación con el botón "Atrás" del navegador
      window.addEventListener('popstate', () => {
        this.cargarModuloActual();
      });
    },

    /**
     * Controles UI (minimizar, fullscreen en tarjetas)
     */
    controlesDiv: function () {
      $(".card-header-right .minimize-card").on('click', function () {
        const $this = $(this);
        const port = $this.parents('.card');
        port.children('.card-block').slideToggle();
        $(this).toggleClass("icon-minus").fadeIn('slow');
        $(this).toggleClass("icon-plus").fadeIn('slow');
      });

      $(".card-header-right .full-card").on('click', function () {
        const $this = $(this);
        const port = $this.parents('.card');
        port.toggleClass("full-card");
        $(this).toggleClass("icon-maximize");
        $(this).toggleClass("icon-minimize");
      });
    }
  };

  // Exponer globalmente
  window.ERP = ERP;

  // Inicializar cuando el DOM esté listo
  $(document).ready(() => ERP.init());
})();
