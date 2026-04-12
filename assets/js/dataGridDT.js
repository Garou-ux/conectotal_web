function DataTableComponent(containerId, apiColumnsPath, apiDataPath, moduloAltaRuta, options = {}) {
  this.containerId = containerId;
  this.apiColumnsPath = apiColumnsPath;
  this.apiDataPath = apiDataPath;
  this.moduloAltaRuta = moduloAltaRuta;
  this.labelNuevo = options.labelNuevo || 'Nuevo';
  this.enableDateRange = options.enableDateRange || false;
  this.tableInstance = null;
  this._controlsBuilt = false;
  this.headerClass = options.headerClass || '';
  this.extraActions = Array.isArray(options.extraActions) ? options.extraActions : [];
}

DataTableComponent.prototype.init = async function (onDataLoaded = () => {}) {
  const self = this;

  if (!this._controlsBuilt) {
    $(`#${this.containerId}`).before(this._buildControlCard());
    if (self.enableDateRange) this._initDateFields();
    this._bindEvents(onDataLoaded);
    this._controlsBuilt = true;
  }

  try {
    const [colsRes, dataRes] = await Promise.all([
      Api.post(this.apiColumnsPath),
      Api.post(this.apiDataPath, this._getFilterParams())
    ]);

    if (colsRes.status !== 'success' || dataRes.status !== 'success') {
      throw new Error('Error cargando columnas o datos');
    }

    const columnas = colsRes.data;
    const datos = dataRes.data;

    if (typeof onDataLoaded === 'function') onDataLoaded(datos);

    const dtColumns = columnas.map(col => ({
      data: col.dataField,
      title: col.caption
    }));

    dtColumns.push({
      data: null,
      title: 'Acciones',
      orderable: false,
      searchable: false,
      width: self.extraActions.length ? '180px' : '120px',
      render: function (data, type, row) {
        const extraButtons = self.extraActions.map((action, index) => `
          <button
            class="btn btn-sm ${action.className || 'btn-info'} btn-extra-action"
            data-id="${row.id}"
            data-extra-index="${index}"
            title="${action.title || 'Accion'}"
            type="button"
          >${action.text || '•'}</button>
        `).join('');

        return `
          <div class="d-flex gap-1 flex-wrap">
            <button class="btn btn-sm btn-primary btn-edit" data-id="${row.id}" title="Editar" type="button">✎</button>
            ${extraButtons}
            <button class="btn btn-sm btn-danger btn-delete" data-id="${row.id}" title="Eliminar" type="button">🗑</button>
          </div>
        `;
      }
    });

    if (self.tableInstance) {
      self.tableInstance.clear();
      self.tableInstance.destroy();
      $(`#${self.containerId}`).empty();
      self.tableInstance = null;
    }

    self.tableInstance = $(`#${self.containerId}`).DataTable({
      data: datos,
      columns: dtColumns,
      responsive: true,
      processing: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json'
      }
    });

    if (self.headerClass) {
      $(`#${self.containerId} thead`).addClass(self.headerClass);
    }

    $(`#${self.containerId}`)
      .off('click.dt.edit')
      .on('click.dt.edit', '.btn-edit', function () {
        const id = $(this).data('id');
        self.navegarAModulo(id);
      });

    $(`#${self.containerId}`)
      .off('click.dt.extra')
      .on('click.dt.extra', '.btn-extra-action', function () {
        const actionIndex = parseInt($(this).data('extra-index'), 10);
        const action = self.extraActions[actionIndex];
        if (!action || typeof action.onClick !== 'function') return;

        const row = self.tableInstance.row($(this).closest('tr')).data() || { id: $(this).data('id') };
        action.onClick(row);
      });

    $(`#${self.containerId}`)
      .off('click.dt.delete')
      .on('click.dt.delete', '.btn-delete', function () {
        const id = $(this).data('id');
        if (confirm('¿Eliminar este registro?')) {
          alert('Eliminar: ID ' + id);
        }
      });

  } catch (err) {
    console.error('Error en DataTableComponent:', err);
    $(`#${this.containerId}`).html('<div class="alert alert-danger">No se pudo cargar el grid.</div>');
  }
};

DataTableComponent.prototype._buildControlCard = function () {
  return `
    <div class="card mb-3 dt-controls-card">
      <div class="card-block">
        <div class="d-flex align-items-center justify-content-between flex-wrap">
          ${this.enableDateRange ? `
            <div class="row gx-2 gy-2 align-items-center mt-2 mt-md-0">
              <div class="col-12 col-sm-auto">
                <input type="date" class="form-control form-control-sm" id="dt-dateStart" />
              </div>
              <div class="col-12 col-sm-auto">
                <input type="date" class="form-control form-control-sm" id="dt-dateEnd" />
              </div>
            </div>` : ''}
          <div class="d-flex align-items-center flex-wrap">
            <button type="button" id="dt-btnNuevo" class="btn btn-sm btn-success me-2 m-b-5">
              <i class="icofont icofont-ui-add"></i><span class="ms-1">${this.labelNuevo}</span>
            </button>
            <button type="button" id="dt-btnExportar" class="btn btn-sm btn-primary me-2 m-b-5">
              <i class="icofont icofont-file-excel"></i>
            </button>
            <button type="button" id="dt-btnRecargar" class="btn btn-sm btn-secondary m-b-5">
              <i class="icofont icofont-refresh"></i>
            </button>
          </div>
        </div>
      </div>
    </div>`;
};

DataTableComponent.prototype._initDateFields = function () {
  const today = new Date();
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);
  const pad = n => String(n).padStart(2, '0');
  const fmt = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  $('#dt-dateStart').val(fmt(today));
  $('#dt-dateEnd').val(fmt(nextMonth));
};

DataTableComponent.prototype._getFilterParams = function () {
  if (!this.enableDateRange) return {};
  return {
    dateStart: $('#dt-dateStart').val(),
    dateEnd: $('#dt-dateEnd').val()
  };
};

DataTableComponent.prototype._bindEvents = function (onDataLoaded) {
  const self = this;

  $(document)
    .off('click.dt.new')
    .on('click.dt.new', '#dt-btnNuevo', function () {
      self.navegarAModulo(0);
    });

  $(document)
    .off('click.dt.reload')
    .on('click.dt.reload', '#dt-btnRecargar', function () {
      if (self.tableInstance) {
        self.tableInstance.clear();
        self.tableInstance.destroy();
        self.tableInstance = null;
      }
      self.init(onDataLoaded);
    });

  $(document)
    .off('click.dt.export')
    .on('click.dt.export', '#dt-btnExportar', function () {
      if (!self.tableInstance) return alert('Tabla no lista');
      const table = document.querySelector(`#${self.containerId} table`);
      if (!table) return alert('Tabla no disponible para exportar');
      const wb = XLSX.utils.table_to_book(table, { sheet: 'Datos' });
      XLSX.writeFile(wb, 'export.xlsx');
    });

  if (this.enableDateRange) {
    $(document)
      .off('change.dt.dates')
      .on('change.dt.dates', '#dt-dateStart, #dt-dateEnd', function () {
        if (self.tableInstance) {
          self.tableInstance.clear();
          self.tableInstance.destroy();
          self.tableInstance = null;
        }
        self.init(onDataLoaded);
      });
  }
};

DataTableComponent.prototype.navegarAModulo = function (id) {
  ERP.navegarAModulo(this.moduloAltaRuta, id);
};
