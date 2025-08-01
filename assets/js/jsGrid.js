function JsGridComponent(containerId, apiColumnsPath, apiDataPath, moduloAltaRuta, options = {}) {
  this.containerId = containerId;
  this.apiColumnsPath = apiColumnsPath;
  this.apiDataPath = apiDataPath;
  this.moduloAltaRuta = moduloAltaRuta;
  this.labelNuevo = options.labelNuevo || 'Nuevo';
  this.enableDateRange = options.enableDateRange || false;
}


JsGridComponent.prototype.init = async function (onDataLoaded = () => {}) {
  const self = this;

  // Verifica si los controles ya existen (evita duplicarlos)
  if ($(`#${this.containerId}`).prev('.jsgrid-controls-card').length === 0) {
    $(`#${this.containerId}`).before(this._buildControlCard());

    // Solo inicializa fechas si es primera vez que se renderiza
    if (self.enableDateRange) {
      this._initDateFields();
    }

    this._bindEvents(onDataLoaded); // También solo se necesita una vez
  }

  try {
    const [columnasRes, datosRes] = await Promise.all([
      Api.post(this.apiColumnsPath),
      Api.post(this.apiDataPath, this._getFilterParams())
    ]);

    if (columnasRes.status !== 'success' || datosRes.status !== 'success') {
      throw new Error('Error al cargar columnas o datos');
    }

    const columnas = columnasRes.data;
    const datos = datosRes.data;

    if (typeof onDataLoaded === 'function') {
      onDataLoaded(datos);
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
        const $edit = $('<button>')
          .addClass('btn btn-sm btn-primary me-1')
          .text('✎')
          .on('click', () => self.navegarAModulo(item.id));

        const $delete = $('<button>')
          .addClass('btn btn-sm btn-danger')
          .text('🗑')
          .on('click', function () {
            if (confirm('¿Eliminar este registro?')) {
              alert('Eliminar: ID ' + item.id); // Aquí puedes implementar DELETE real
            }
          });

        return $('<div>').append($edit).append($delete);
      },
      width: 80,
      align: 'center'
    });

    $('#' + self.containerId).jsGrid({
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
    console.error('Error cargando el grid:', error);
    $(`#${this.containerId}`).html('<div class="alert alert-danger">Error al cargar la información del grid.</div>');
  }
};


JsGridComponent.prototype._buildControlCard = function () {
  return `
    <div class="card mb-3 jsgrid-controls-card">
      <div class="card-block">
        <div class="d-flex align-items-center justify-content-between flex-wrap">

          ${this.enableDateRange
            ? `
              <div class="row gx-2 gy-2 align-items-center mt-2 mt-md-0">
                <div class="col-12 col-sm-auto">
                  <input type="date" class="form-control form-control-sm" id="dateStart" />
                </div>
                <div class="col-12 col-sm-auto">
                  <input type="date" class="form-control form-control-sm" id="dateEnd" />
                </div>
              </div>
            `
            : ''
          }

          <div class="d-flex align-items-center flex-wrap">
            <button type="button" id="btnNuevo" class="btn btn-sm btn-success me-2 m-b-5">
              <i class="icofont icofont-ui-add"></i><span class="ms-1">${this.labelNuevo}</span>
            </button>
            <button type="button" id="btnExportar" class="btn btn-sm btn-primary me-2 m-b-5">
              <i class="icofont icofont-file-excel"></i>
            </button>
            <button type="button" id="btnRecargar" class="btn btn-sm btn-secondary m-b-5">
              <i class="icofont icofont-refresh"></i>
            </button>
          </div>

        </div>
      </div>
    </div>`;
};

JsGridComponent.prototype._initDateFields = function () {
  const today = new Date();
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  $('#dateStart').val(formatDate(today));
  $('#dateEnd').val(formatDate(nextMonth));
};

JsGridComponent.prototype._getFilterParams = function () {
  if (!this.enableDateRange) return {};

  const dateStart = $('#dateStart').val();
  const dateEnd = $('#dateEnd').val();
  return { dateStart, dateEnd };
};

JsGridComponent.prototype._bindEvents = function (onDataLoaded) {
  const self = this;

  $(document).off('click', '#btnNuevo').on('click', '#btnNuevo', function () {
    self.navegarAModulo(0);
  });

  $(document).off('click', '#btnRecargar').on('click', '#btnRecargar', function () {
    self.init(onDataLoaded);
  });

  $(document).off('click', '#btnExportar').on('click', '#btnExportar', function () {
    const table = document.querySelector(`#${self.containerId} table`);
    if (!table) return alert('Tabla no disponible para exportar');

    const wb = XLSX.utils.table_to_book(table, { sheet: 'Datos' });
    XLSX.writeFile(wb, 'export.xlsx');
  });

  if (this.enableDateRange) {
    $(document).off('change', '#dateStart, #dateEnd').on('change', '#dateStart, #dateEnd', function () {
      self.init(onDataLoaded);
    });
  }
};

JsGridComponent.prototype.navegarAModulo = function (id) {
  ERP.navegarAModulo(this.moduloAltaRuta, id);
};
