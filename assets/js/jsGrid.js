// function JsGridComponent(containerId, apiColumnsUrl, apiDataUrl, moduloAltaRuta) {
//   this.containerId = containerId;
//   this.apiColumnsUrl = apiColumnsUrl;
//   this.apiDataUrl = apiDataUrl;
//   this.moduloAltaRuta = moduloAltaRuta;
// }

// JsGridComponent.prototype.init = function (onDataLoaded = () => {}) {
//   const self = this;

//   const $wrapper = $('#' + this.containerId);
//   const $buttonNuevo = $('<button class="btn btn-sm btn-success mb-2">+ Nuevo</button>');
//   $buttonNuevo.on('click', function () {
//     self.navegarAModulo(0);
//   });
//   $wrapper.before($buttonNuevo);

//   $.when(
//     Api.post(this.apiColumnsUrl),
//     Api.post(this.apiDataUrl)
//   ).done(function (columnasRes, dataRes) {
//     const columnas = columnasRes.data;
//     const datos = dataRes.data;

//     // Callback personalizado con los datos
//     if (typeof onDataLoaded === 'function') {
//       onDataLoaded(datos);
//     }

//     const campos = columnas.map(col => ({
//       name: col.dataField,
//       title: col.caption,
//       type: col.dataType || 'text',
//       width: 100
//     }));

//     campos.push({
//       type: 'control',
//       itemTemplate: function (_, item) {
//         const $edit = $('<button>')
//           .addClass('btn btn-sm btn-primary me-1')
//           .text('✎')
//           .on('click', () => self.navegarAModulo(item.id));

//         const $delete = $('<button>')
//           .addClass('btn btn-sm btn-danger')
//           .text('🗑')
//           .on('click', function () {
//             if (confirm('¿Eliminar este registro?')) {
//               alert('Eliminar: ID ' + item.id); // Aquí puedes implementar DELETE real
//             }
//           });

//         return $('<div>').append($edit).append($delete);
//       },
//       width: 80,
//       align: 'center'
//     });

//     $('#' + self.containerId).jsGrid({
//       height: 'auto',
//       width: '100%',
//       filtering: true,
//       sorting: true,
//       paging: true,
//       autoload: true,
//       data: datos,
//       fields: campos
//     });
//   });
// };

// JsGridComponent.prototype.navegarAModulo = function (id) {
//   ERP.navegarAModulo(this.moduloAltaRuta, id);
// };

// function JsGridComponent(containerId, apiColumnsPath, apiDataPath, moduloAltaRuta) {
//   this.containerId = containerId;
//   this.apiColumnsPath = apiColumnsPath;
//   this.apiDataPath = apiDataPath;
//   this.moduloAltaRuta = moduloAltaRuta;
// }

// JsGridComponent.prototype.init = async function (onDataLoaded = () => {}) {
//   const self = this;

//   const $wrapper = $('#' + this.containerId);
//   const $buttonNuevo = $('<button class="btn btn-sm btn-success mb-2">+ Nuevo</button>');
//   $buttonNuevo.on('click', function () {
//     self.navegarAModulo(0); // id = 0 => nuevo
//   });
//   $wrapper.before($buttonNuevo);

//   try {
//     const [columnasRes, datosRes] = await Promise.all([
//       Api.post(this.apiColumnsPath),
//       Api.post(this.apiDataPath)
//     ]);

//     if (columnasRes.status !== 'success' || datosRes.status !== 'success') {
//       throw new Error('Error al cargar columnas o datos');
//     }

//     const columnas = columnasRes.data;
//     const datos = datosRes.data;

//     // Ejecutar callback con los datos cargados
//     if (typeof onDataLoaded === 'function') {
//       onDataLoaded(datos);
//     }

//     const campos = columnas.map(col => ({
//       name: col.dataField,
//       title: col.caption,
//       type: col.dataType || 'text',
//       width: 100
//     }));

//     // Agregar columna de acciones
//     campos.push({
//       type: 'control',
//       itemTemplate: function (_, item) {
//         const $edit = $('<button>').addClass('btn btn-sm btn-primary me-1').text('✎').on('click', function () {
//           self.navegarAModulo(item.id);
//         });
//         const $delete = $('<button>').addClass('btn btn-sm btn-danger').text('🗑').on('click', function () {
//           if (confirm('¿Eliminar registro?')) {
//             alert('Eliminar: ID ' + item.id); // Aquí puedes implementar el DELETE real
//           }
//         });
//         return $('<div>').append($edit).append($delete);
//       },
//       width: 80,
//       align: 'center'
//     });

//     $('#' + self.containerId).jsGrid({
//       height: 'auto',
//       width: '100%',
//       filtering: true,
//       sorting: true,
//       paging: true,
//       autoload: true,
//       data: datos,
//       fields: campos
//     });

//   } catch (error) {
//     console.error('Error cargando el grid:', error);
//     $wrapper.html('<div class="alert alert-danger">Error al cargar la información del grid.</div>');
//   }
// };

// JsGridComponent.prototype.navegarAModulo = function (id) {
//   ERP.navegarAModulo(this.moduloAltaRuta, id);
// };




function JsGridComponent(containerId, apiColumnsPath, apiDataPath, moduloAltaRuta, options = {}) {
  this.containerId = containerId;
  this.apiColumnsPath = apiColumnsPath;
  this.apiDataPath = apiDataPath;
  this.moduloAltaRuta = moduloAltaRuta;

  // Opcionales
  this.labelNuevo = options.labelNuevo || 'Nuevo';
  this.enableDateRange = options.enableDateRange || false;
  this.onDataLoaded = options.onDataLoaded || function () { };
}

JsGridComponent.prototype.init = async function () {
    const self = this;
    const $wrapper = $('#' + self.containerId);
    $wrapper.empty();


    const $card = $(`
    <div class="card mb-3">
        <div class="card-block">
        <div class="d-flex flex-wrap align-items-center gap-2">
            ${self.enableDateRange ? `
            <input type="text" class="form-control form-control-sm me-2" id="dateStart" style="max-width: 150px;" placeholder="Fecha inicio">
            <input type="text" class="form-control form-control-sm me-3" id="dateEnd" style="max-width: 150px;" placeholder="Fecha fin">
            ` : ''}
            <button type="button" class="btn btn-sm btn-success" id="btnNuevo">
            <i class="icofont icofont-ui-add"></i> ${self.labelNuevo}
            </button>
            <button type="button" class="btn btn-sm btn-primary" id="btnExportExcel">
            <i class="icofont icofont-file-excel"></i>
            </button>
            <button type="button" class="btn btn-sm btn-secondary" id="btnReload">
            <i class="icofont icofont-refresh"></i>
            </button>
        </div>
        </div>
    </div>
    `);

    $wrapper.before($card);

    // Flatpickr si se habilita
    if (self.enableDateRange) {
        flatpickr("#dateStart", { dateFormat: "Y-m-d" });
        flatpickr("#dateEnd", { dateFormat: "Y-m-d" });

        $("#dateStart, #dateEnd").on("change", function () {
        self.loadGrid(); // reload al cambiar fechas
        });
    }

    // Botón de nuevo
    $card.find('#btnNuevo').on('click', function () {
        self.navegarAModulo(0);
    });

    // Botón Excel
    $card.find('#btnExportExcel').on('click', function () {
        const table = $wrapper.find("table")[0];
        if (!table) return alert("No hay datos para exportar.");
        const wb = XLSX.utils.table_to_book(table);
        XLSX.writeFile(wb, "exportado.xlsx");
    });

    $card.find('#btnReload').on('click', function () {
        self.loadGrid();
    });

    // Cargar el grid por primera vez
    await self.loadGrid();
};

JsGridComponent.prototype.loadGrid = async function () {
  const self = this;
  const $wrapper = $('#' + self.containerId);
  $wrapper.html('<div class="text-center p-3">Cargando...</div>');

  try {
    const filtros = {};

    if (self.enableDateRange) {
      filtros.dateStart = $('#dateStart').val();
      filtros.dateEnd = $('#dateEnd').val();
    }

    const [columnasRes, datosRes] = await Promise.all([
      Api.post(self.apiColumnsPath, filtros),
      Api.post(self.apiDataPath, filtros)
    ]);

    if (columnasRes.status !== 'success' || datosRes.status !== 'success') {
      throw new Error('Error al cargar columnas o datos');
    }

    const columnas = columnasRes.data;
    const datos = datosRes.data;

    if (typeof self.onDataLoaded === 'function') {
      self.onDataLoaded(datos);
    }

    const campos = columnas.map(col => ({
      name: col.dataField,
      title: col.caption,
      type: col.dataType || 'text',
      width: 100
    }));

    campos.push({
      type: 'control',
      itemTemplate: function (_, item) {
        const $edit = $('<button>').addClass('btn btn-sm btn-primary me-1').text('✎').on('click', function () {
          self.navegarAModulo(item.id);
        });

        const $delete = $('<button>').addClass('btn btn-sm btn-danger').text('🗑').on('click', function () {
          if (confirm('¿Eliminar registro?')) {
            alert('Eliminar: ID ' + item.id);
          }
        });

        return $('<div>').append($edit).append($delete);
      },
      width: 80,
      align: 'center'
    });

    $wrapper.empty().jsGrid({
      height: 'auto',
      width: '100%',
      filtering: true,
      sorting: true,
      paging: true,
      autoload: true,
      data: datos,
      fields: campos
    });

  } catch (error) {
    console.error('Error al cargar el grid:', error);
    $wrapper.html('<div class="alert alert-danger">Error al cargar datos.</div>');
  }
};

JsGridComponent.prototype.navegarAModulo = function (id) {
  ERP.navegarAModulo(this.moduloAltaRuta, id);
};
