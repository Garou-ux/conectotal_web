(function () {
  const ERP = {
    getBasePath: function () {
      const parts = window.location.pathname.split('/');
      parts.pop();
      return parts.join('/') || '/';
    },

    getModuloUrl: function (modulo, id = null) {
      const url = new URL(window.location.origin + this.getBasePath() + '/home.html');
      url.searchParams.set('modulo', modulo);
      if (id !== null) url.searchParams.set('id', id);
      return url.toString();
    },

    initDynamicSidebar: function () {
      const basePath = this.getBasePath();
      $('[data-modulo]').each(function () {
        const modulo = $(this).data('modulo');
        $(this).attr('href', `${basePath}/home.html?modulo=${modulo}`);
      });
    },

    cargarModuloActual: function () {
      const params = new URLSearchParams(window.location.search);
      const modulo = params.get('modulo') || 'dashboard';
      const id = params.get('id') || null;

      const rutaHtml = `modules/${modulo}.html`;
      const rutaJs = `modules/${modulo}.js`;

      $('#contenido').load(rutaHtml, function (response, status) {
        if (status === 'error') {
          $('#contenido').html('<div class="alert alert-danger">Módulo no encontrado.</div>');
        } else {
          $.getScript(rutaJs)
            .done(() => {
              console.log(`${modulo}.js cargado`);
              if (typeof ERP.onModuloCargado === 'function') {
                ERP.onModuloCargado(modulo, id);
              }
            })
            .fail(() => {
              console.warn(`${modulo}.js no encontrado`);
              if (typeof ERP.onModuloCargado === 'function') {
                ERP.onModuloCargado(modulo, id);
              }
            });
        }
      });
    },

    onModuloCargado: function (modulo, id) {
      console.log(`[Hook] Módulo cargado: ${modulo}`, { id });

      // Puedes extender con hooks específicos
      if (modulo === 'facturas' && typeof ERP.initFacturas === 'function') ERP.initFacturas();
      if (modulo === 'cotizaciones' && typeof ERP.initCotizaciones === 'function') ERP.initCotizaciones();
    },

    navegarAModulo: function (modulo, id = null) {
      const url = new URL(window.location.href);
      url.searchParams.set('modulo', modulo);
      if (id !== null) url.searchParams.set('id', id);
      else url.searchParams.delete('id');

      window.history.pushState({}, '', url);
      this.cargarModuloActual();
    },

    init: function () {
      this.initDynamicSidebar();
      this.cargarModuloActual();

      window.addEventListener('popstate', () => {
        this.cargarModuloActual();
      });
    },

    controlesDiv: function(){
        $(".card-header-right .minimize-card").on('click', function() {
            var $this = $(this);
            var port = $($this.parents('.card'));
            var card = $(port).children('.card-block').slideToggle();
            $(this).toggleClass("icon-minus").fadeIn('slow');
            $(this).toggleClass("icon-plus").fadeIn('slow');
        });
        $(".card-header-right .full-card").on('click', function() {
            var $this = $(this);
            var port = $($this.parents('.card'));
            port.toggleClass("full-card");
            $(this).toggleClass("icon-maximize");
            $(this).toggleClass("icon-minimize");
        });
    },

  };

  window.ERP = ERP;

  $(document).ready(() => ERP.init());
})();
