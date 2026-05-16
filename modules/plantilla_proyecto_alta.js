let plantillaProyectoState = {
  supervisores: [],
  trabajadores: [],
  semanas: [],
  detalles: [],
  selectedId: 0
};

$(document).ready(function () {
  getDataControl('/plantillaProyectos/getData', function (response) {
    const payload = response.data || {};
    const data = payload.data || null;

    plantillaProyectoState.supervisores = Array.isArray(payload.supervisores) ? payload.supervisores : [];
    plantillaProyectoState.trabajadores = Array.isArray(payload.trabajadores) ? payload.trabajadores : [];
    plantillaProyectoState.semanas = Array.isArray(payload.semanas) ? payload.semanas : [];
    plantillaProyectoState.selectedId = data && data.id ? parseInt(data.id, 10) : 0;

    renderCatalogSelects();
    bindPlantillaProyectoEvents();

    if (data) {
      $('#titulo').text('Editar');
      MainFiller.fill(data);
      plantillaProyectoState.detalles = hydrateDetalles(data.detalles || []);
      $('#buttonVerReporte').show();
      $('#buttonDescargarExcel').show();
      loadReportPreview(data.id);
    } else {
      $('#titulo').text('Nueva');
      selectCurrentSemana();
      plantillaProyectoState.detalles = [createEmptyDetalle()];
      syncHeaderWithSemana();
    }

    renderDetalles();
  });

  submitForm({
    formId: 'formController',
    apiPath: '/plantillaProyectos/setData',
    validation: {
      supervisor_id: { label: 'Supervisor' },
      catalogo_semana_id: { label: 'Semana' }
    },
    callbackExtraParams: function () {
      return {
        detalles: buildDetallePayload()
      };
    },
    validateArrays: function () {
      const detalles = buildDetallePayload();
      if (!detalles.length) {
        alert('Agrega al menos un trabajador.');
        return false;
      }

      const invalid = detalles.some(detalle => !detalle.trabajador_id);
      if (invalid) {
        alert('Cada bloque debe tener un trabajador seleccionado.');
        return false;
      }

      return true;
    },
    onSuccess: (response) => {
      const savedId = response?.data?.id || response?.data?.data?.id || plantillaProyectoState.selectedId;
      alert('Guardado correctamente');
      ERP.navegarAModulo('plantilla_proyecto_alta', savedId || 0);
    },
    onError: (err) => {
      console.error('Error al guardar:', err);
      alert('Error al guardar. Revisa la consola.');
    }
  });

  ERP.controlesDiv();

  $('#buttonCerrar').click(function () {
    ERP.navegarAModulo('plantilla_proyectos');
  });

  $('#buttonVerReporte').click(function () {
    if (plantillaProyectoState.selectedId > 0) {
      ERP.navegarAModulo('plantilla_proyecto_reporte', plantillaProyectoState.selectedId);
    }
  });

  $('#buttonDescargarExcel').click(function () {
    if (plantillaProyectoState.selectedId > 0) {
      downloadReporteExcel(plantillaProyectoState.selectedId);
    }
  });
});

function bindPlantillaProyectoEvents() {
  $('#supervisor_id').off('change').on('change', function () {
    renderDetalles();
  });

  $('#catalogo_semana_id').off('change').on('change', function () {
    syncHeaderWithSemana();
    plantillaProyectoState.detalles = plantillaProyectoState.detalles.map(detalle => syncDetalleWithSemana(detalle));
    renderDetalles();
  });

  $('#buttonAgregarDetalle').off('click').on('click', function () {
    plantillaProyectoState.detalles.push(createEmptyDetalle());
    renderDetalles();
  });
}

function renderCatalogSelects() {
  $('#supervisor_id').populateSelect({
    obj: plantillaProyectoState.supervisores,
    map: { value: 'id', text: ['nombre', 'apellido_paterno', 'apellido_materno'] },
    empty: true,
    search: false
  });

  $('#catalogo_semana_id').populateSelect({
    obj: plantillaProyectoState.semanas,
    map: { value: 'id', text: ['descripcion'] },
    empty: true,
    search: false
  });
}

function getSemanaSeleccionada() {
  const semanaId = parseInt($('#catalogo_semana_id').val(), 10);
  if (!semanaId) return null;
  return plantillaProyectoState.semanas.find(item => parseInt(item.id, 10) === semanaId) || null;
}

function selectCurrentSemana() {
  const semana = findCurrentSemana();
  if (!semana) return;

  $('#catalogo_semana_id').val(String(semana.id)).trigger('change.select2');
}

function findCurrentSemana() {
  const today = clearTime(new Date());
  const byCurrentFlag = plantillaProyectoState.semanas.find(item =>
    isTruthy(item.actual) ||
    isTruthy(item.es_actual) ||
    isTruthy(item.current) ||
    isTruthy(item.is_current) ||
    isTruthy(item.vigente) ||
    isTruthy(item.semana_actual)
  );

  if (byCurrentFlag) return byCurrentFlag;

  const byDateRange = plantillaProyectoState.semanas.find(item => {
    const start = parseLocalDate(getFirstValue(item, ['fecha_inicio', 'fecha_inicial', 'inicio', 'start', 'start_date']));
    const end = parseLocalDate(getFirstValue(item, ['fecha_fin', 'fecha_final', 'fin', 'end', 'end_date']));

    return start && end && today >= start && today <= end;
  });

  if (byDateRange) return byDateRange;

  const currentYear = today.getFullYear();
  const currentWeeks = [
    getIsoWeekNumber(today),
    getSundayWeekNumber(today),
    getMondayWeekNumber(today)
  ];

  return plantillaProyectoState.semanas.find(item =>
    parseInt(item.anio, 10) === currentYear &&
    currentWeeks.includes(parseInt(item.semana, 10))
  ) || plantillaProyectoState.semanas.find(item =>
    parseInt(item.anio, 10) === currentYear &&
    currentWeeks.some(week => containsWeekNumber(item.descripcion, week))
  ) || null;
}

function syncHeaderWithSemana() {
  const semana = getSemanaSeleccionada();
  if (!semana) return;

  $('#anio').val(semana.anio || '');
  $('#mes').val(semana.mes || '');
  $('#semana').val(semana.semana || '');
  $('#fecha_inicio').val(formatDateInput(semana.fecha_inicio));
  $('#fecha_fin').val(formatDateInput(semana.fecha_fin));
}

function getWeekDaysFromHeader() {
  const semana = getSemanaSeleccionada();
  const startDate = semana && semana.fecha_inicio ? new Date(semana.fecha_inicio) : null;
  const labels = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'];

  return labels.map((fallback, index) => {
    const currentDate = startDate ? new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + index) : null;
    return {
      dia_semana: index + 1,
      fecha: currentDate ? toYmd(currentDate) : '',
      nombre_dia: currentDate ? formatDayLabel(currentDate) : fallback,
      horas_normales: 0,
      horas_extra: 0,
      numero_proyecto: $('#numero_proyecto').val() || ''
    };
  });
}

function createEmptyDetalle() {
  const weekDays = getWeekDaysFromHeader();
  return {
    id: null,
    trabajador_id: '',
    ficha: '',
    nombre_trabajador: '',
    bono_puntualidad: true,
    observaciones: '',
    descanso_dia: 7,
    dias: weekDays
  };
}

function hydrateDetalles(detalles) {
  return (detalles || []).map(detalle => {
    const descansoDia = (detalle.dias || []).find(dia => dia.es_descanso);
    const normalized = {
      id: detalle.id || null,
      trabajador_id: detalle.trabajador_id || '',
      ficha: detalle.ficha || '',
      nombre_trabajador: detalle.nombre_trabajador || '',
      bono_puntualidad: detalle.bono_puntualidad !== false,
      observaciones: detalle.observaciones || '',
      descanso_dia: descansoDia ? parseInt(descansoDia.dia_semana, 10) : 7,
      dias: []
    };

    const weekDays = getWeekDaysFromHeader();

    normalized.dias = weekDays.map(baseDay => {
      const existing = (detalle.dias || []).find(item => parseInt(item.dia_semana, 10) === baseDay.dia_semana) || {};
      return {
        id: existing.id || null,
        dia_semana: baseDay.dia_semana,
        fecha: formatDateInput(existing.fecha || baseDay.fecha),
        nombre_dia: existing.nombre_dia || baseDay.nombre_dia,
        horas_normales: parseFloat(existing.horas_normales || 0),
        horas_extra: parseFloat(existing.horas_extra || 0),
        numero_proyecto: existing.numero_proyecto || $('#numero_proyecto').val() || '',
        proyecto_id: existing.proyecto_id || null
      };
    });

    return normalized;
  });
}

function syncDetalleWithSemana(detalle) {
  const latestDays = getWeekDaysFromHeader();
  const detail = $.extend(true, {}, detalle);

  detail.dias = latestDays.map(baseDay => {
    const existing = (detalle.dias || []).find(item => parseInt(item.dia_semana, 10) === baseDay.dia_semana) || {};
    return {
      id: existing.id || null,
      dia_semana: baseDay.dia_semana,
      fecha: baseDay.fecha,
      nombre_dia: baseDay.nombre_dia,
      horas_normales: parseFloat(existing.horas_normales || 0),
      horas_extra: parseFloat(existing.horas_extra || 0),
      numero_proyecto: existing.numero_proyecto || $('#numero_proyecto').val() || '',
      proyecto_id: existing.proyecto_id || null
    };
  });

  return detail;
}

function renderDetalles() {
  const $container = $('#detallesContainer');
  $container.empty();

  if (!plantillaProyectoState.detalles.length) {
    $container.html('<div class="alert alert-warning">Agrega un trabajador para iniciar la captura.</div>');
    return;
  }

  plantillaProyectoState.detalles.forEach((detalle, index) => {
    const workerOptions = buildTrabajadorOptions(detalle.trabajador_id);
    const resumen = calculateResumen(detalle);
    const descansoOptions = detalle.dias.map(dia => `
      <option value="${dia.dia_semana}" ${parseInt(detalle.descanso_dia, 10) === dia.dia_semana ? 'selected' : ''}>${dia.nombre_dia}</option>
    `).join('');

    const daysHeader = detalle.dias.map(dia => `<th class="text-center">${dia.nombre_dia}</th>`).join('');
    const rowNormal = detalle.dias.map(dia => `
      <td><input type="number" step="0.5" min="0" class="form-control form-control-sm detalle-horas-normales" data-index="${index}" data-dia="${dia.dia_semana}" value="${dia.horas_normales || 0}"></td>
    `).join('');
    const rowExtra = detalle.dias.map(dia => `
      <td><input type="number" step="0.5" min="0" class="form-control form-control-sm detalle-horas-extra" data-index="${index}" data-dia="${dia.dia_semana}" value="${dia.horas_extra || 0}"></td>
    `).join('');
    const rowProyecto = detalle.dias.map(dia => `
      <td><input type="text" class="form-control form-control-sm detalle-proyecto-dia" data-index="${index}" data-dia="${dia.dia_semana}" value="${dia.numero_proyecto || ''}"></td>
    `).join('');

    const html = `
      <div class="card card-outline-primary plantilla-detalle-card" data-index="${index}">
        <div class="card-header d-flex justify-content-between align-items-center flex-wrap">
          <h6 class="m-b-0">Trabajador ${index + 1}</h6>
          <button type="button" class="btn btn-danger btn-sm buttonEliminarDetalle" data-index="${index}">Quitar</button>
        </div>
        <div class="card-block">
          <div class="row form-row">
            <div class="form-group col-md-4">
              <label>Trabajador:</label>
              <select class="form-control form-control-sm detalle-trabajador" data-index="${index}">
                <option value="">Seleccione</option>
                ${workerOptions}
              </select>
            </div>
            <div class="form-group col-md-2">
              <label>Ficha:</label>
              <input type="text" class="form-control form-control-sm detalle-ficha" data-index="${index}" value="${detalle.ficha || ''}" readonly>
            </div>
            <div class="form-group col-md-3">
              <label>Día descanso:</label>
              <select class="form-control form-control-sm detalle-descanso" data-index="${index}">${descansoOptions}</select>
            </div>
            <div class="form-group col-md-3">
              <label>Bono puntualidad:</label>
              <div class="form-control form-control-sm d-flex align-items-center">
                <input type="checkbox" class="detalle-bono" data-index="${index}" ${detalle.bono_puntualidad ? 'checked' : ''}>
                <span class="m-l-10">Activo</span>
              </div>
            </div>
          </div>
          <div class="row form-row">
            <div class="form-group col-md-9">
              <label>Nombre capturado:</label>
              <input type="text" class="form-control form-control-sm detalle-nombre" data-index="${index}" value="${detalle.nombre_trabajador || ''}" readonly>
            </div>
            <div class="form-group col-md-3">
              <label>Observaciones:</label>
              <input type="text" class="form-control form-control-sm detalle-observaciones" data-index="${index}" value="${detalle.observaciones || ''}">
            </div>
          </div>
          <div class="table-responsive">
            <table class="table table-bordered table-sm m-b-0">
              <thead>
                <tr>
                  <th style="min-width:140px;">Concepto</th>
                  ${daysHeader}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Tiempo normal</th>
                  ${rowNormal}
                </tr>
                <tr>
                  <th>Tiempo extra</th>
                  ${rowExtra}
                </tr>
                <tr>
                  <th>Proyecto</th>
                  ${rowProyecto}
                </tr>
              </tbody>
            </table>
          </div>
          <div class="row m-t-15">
            <div class="col-md-12">
              <div class="d-flex flex-wrap gap-2 plantilla-resumen-row">
                <span class="badge badge-primary p-2">TN: <strong class="resumen-tn">${resumen.tn.toFixed(2)}</strong></span>
                <span class="badge badge-info p-2">HES: <strong class="resumen-hes">${resumen.hes.toFixed(2)}</strong></span>
                <span class="badge badge-warning p-2">HDO: <strong class="resumen-hdo">${resumen.hdo.toFixed(2)}</strong></span>
                <span class="badge badge-secondary p-2">HD: <strong class="resumen-hd">${resumen.hd.toFixed(2)}</strong></span>
                <span class="badge badge-success p-2">HT: <strong class="resumen-ht">${resumen.ht.toFixed(2)}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    $container.append(html);
  });

  attachDetalleEvents();
}

function attachDetalleEvents() {
  $('.buttonEliminarDetalle').off('click').on('click', function () {
    const index = parseInt($(this).data('index'), 10);
    plantillaProyectoState.detalles.splice(index, 1);
    if (!plantillaProyectoState.detalles.length) {
      plantillaProyectoState.detalles.push(createEmptyDetalle());
    }
    renderDetalles();
  });

  $('.detalle-trabajador').off('change').on('change', function () {
    const index = parseInt($(this).data('index'), 10);
    const trabajadorId = parseInt($(this).val(), 10) || '';
    const trabajador = plantillaProyectoState.trabajadores.find(item => parseInt(item.id, 10) === trabajadorId) || null;
    const detalle = plantillaProyectoState.detalles[index];

    detalle.trabajador_id = trabajadorId;
    detalle.ficha = trabajador ? (trabajador.ficha || '') : '';
    detalle.nombre_trabajador = trabajador
      ? [trabajador.nombre, trabajador.apellido_paterno, trabajador.apellido_materno].filter(Boolean).join(' ')
      : '';

    renderDetalles();
  });

  $('.detalle-descanso').off('change').on('change', function () {
    const index = parseInt($(this).data('index'), 10);
    plantillaProyectoState.detalles[index].descanso_dia = parseInt($(this).val(), 10) || 7;
    updateResumen(index);
  });

  $('.detalle-bono').off('change').on('change', function () {
    const index = parseInt($(this).data('index'), 10);
    plantillaProyectoState.detalles[index].bono_puntualidad = $(this).is(':checked');
  });

  $('.detalle-observaciones').off('input').on('input', function () {
    const index = parseInt($(this).data('index'), 10);
    plantillaProyectoState.detalles[index].observaciones = $(this).val();
  });

  $('.detalle-horas-normales').off('input').on('input', function () {
    const index = parseInt($(this).data('index'), 10);
    const dia = parseInt($(this).data('dia'), 10);
    const detailDay = plantillaProyectoState.detalles[index].dias.find(item => item.dia_semana === dia);
    detailDay.horas_normales = parseFloat($(this).val()) || 0;
    updateResumen(index);
  });

  $('.detalle-horas-extra').off('input').on('input', function () {
    const index = parseInt($(this).data('index'), 10);
    const dia = parseInt($(this).data('dia'), 10);
    const detailDay = plantillaProyectoState.detalles[index].dias.find(item => item.dia_semana === dia);
    detailDay.horas_extra = parseFloat($(this).val()) || 0;
    updateResumen(index);
  });

  $('.detalle-proyecto-dia').off('input').on('input', function () {
    const index = parseInt($(this).data('index'), 10);
    const dia = parseInt($(this).data('dia'), 10);
    const detailDay = plantillaProyectoState.detalles[index].dias.find(item => item.dia_semana === dia);
    detailDay.numero_proyecto = $(this).val();
  });
}

function updateResumen(index) {
  const detalle = plantillaProyectoState.detalles[index];
  const resumen = calculateResumen(detalle);
  const $card = $(`.plantilla-detalle-card[data-index="${index}"]`);
  $card.find('.resumen-tn').text(resumen.tn.toFixed(2));
  $card.find('.resumen-hes').text(resumen.hes.toFixed(2));
  $card.find('.resumen-hdo').text(resumen.hdo.toFixed(2));
  $card.find('.resumen-hd').text(resumen.hd.toFixed(2));
  $card.find('.resumen-ht').text(resumen.ht.toFixed(2));
}

function buildTrabajadorOptions(selectedId) {
  const supervisorId = parseInt($('#supervisor_id').val(), 10) || 0;
  let trabajadores = plantillaProyectoState.trabajadores;

  if (supervisorId > 0) {
    trabajadores = trabajadores.filter(item => parseInt(item.supervisor_id, 10) === supervisorId || parseInt(item.id, 10) === parseInt(selectedId, 10));
  }

  return trabajadores.slice().sort(compareTrabajadores).map(item => {
    const label = [item.nombre, item.apellido_paterno, item.apellido_materno].filter(Boolean).join(' ');
    const selected = parseInt(selectedId, 10) === parseInt(item.id, 10) ? 'selected' : '';
    return `<option value="${item.id}" ${selected}>${label}</option>`;
  }).join('');
}

function buildDetallePayload() {
  return plantillaProyectoState.detalles.map(detalle => {
    const resumen = calculateResumen(detalle);
    return {
      id: detalle.id || null,
      trabajador_id: detalle.trabajador_id || null,
      ficha: detalle.ficha || '',
      nombre_trabajador: detalle.nombre_trabajador || '',
      bono_puntualidad: detalle.bono_puntualidad ? 1 : 0,
      observaciones: detalle.observaciones || '',
      dias: detalle.dias.map(dia => ({
        id: dia.id || null,
        dia_semana: dia.dia_semana,
        fecha: dia.fecha || '',
        nombre_dia: dia.nombre_dia || '',
        horas_normales: parseFloat(dia.horas_normales || 0),
        horas_extra: parseFloat(dia.horas_extra || 0),
        numero_proyecto: dia.numero_proyecto || $('#numero_proyecto').val() || '',
        proyecto_id: dia.proyecto_id || null,
        es_descanso: parseInt(detalle.descanso_dia, 10) === dia.dia_semana
      })),
      tn: resumen.tn,
      hes: resumen.hes,
      hdo: resumen.hdo,
      hd: resumen.hd,
      ht: resumen.ht
    };
  });
}

function calculateResumen(detalle) {
  const dias = detalle.dias || [];
  const descansoDia = parseInt(detalle.descanso_dia, 10) || 7;
  let tn = 0;
  let hes = 0;
  let hdo = 0;

  dias.forEach(dia => {
    const normales = parseFloat(dia.horas_normales || 0) || 0;
    const extras = parseFloat(dia.horas_extra || 0) || 0;
    const esDescanso = parseInt(dia.dia_semana, 10) === descansoDia;

    if (esDescanso) {
      hdo += normales + extras;
      return;
    }

    tn += normales;
    hes += extras;
  });

  const hd = Math.min(9, hes);
  const ht = Math.max(0, hes - hd);

  return {
    tn,
    hes,
    hdo,
    hd,
    ht
  };
}

function loadReportPreview(id) {
  Api.post('/plantillaProyectos/getReporteData', { id }).then(function (response) {
    const data = response.data || {};
    renderReportTable(data, '#reportPreview');
  }).catch(function (err) {
    console.error('Error cargando reporte:', err);
    $('#reportPreview').html('<div class="alert alert-warning">No se pudo cargar la vista previa del reporte.</div>');
  });
}

function downloadReporteExcel(id) {
  const $button = $('#buttonDescargarExcel');
  const originalText = $button.text();

  $button.prop('disabled', true).text('Descargando...');

  requestReporteExcel(id, Auth.getToken()).catch(function (err) {
    if (err.status === 401) {
      return Auth.refreshToken().then(function (newToken) {
        return requestReporteExcel(id, newToken);
      }).catch(function () {
        Auth.logout();
      });
    }

    throw err;
  }).catch(function (err) {
    console.error('Error descargando Excel:', err);
    alert('No se pudo descargar el Excel. Revisa la consola.');
  }).always(function () {
    $button.prop('disabled', false).text(originalText);
  });
}

function requestReporteExcel(id, token) {
  return $.ajax({
    url: Config.getBaseApiUrl() + '/plantillaProyectos/downloadReporteExcel',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.ms-excel, application/octet-stream',
      'Authorization': 'Bearer ' + token
    },
    data: JSON.stringify({ id }),
    xhrFields: {
      responseType: 'blob'
    }
  }).then(function (blob, textStatus, xhr) {
    const disposition = xhr.getResponseHeader('Content-Disposition') || '';
    const filename = getDownloadFilename(disposition) || `reporte_plantilla_${id}.xls`;
    triggerBlobDownload(blob, filename);
  });
}

function getDownloadFilename(disposition) {
  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match && utf8Match[1]) {
    return decodeURIComponent(utf8Match[1].replace(/["']/g, ''));
  }

  const asciiMatch = disposition.match(/filename="?([^"]+)"?/i);
  return asciiMatch && asciiMatch[1] ? asciiMatch[1] : '';
}

function triggerBlobDownload(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
}

function renderReportTable(reportData, selector) {
  const rows = sortReportRows(Array.isArray(reportData.rows) ? reportData.rows : []);
  const dias = Array.isArray(reportData.dias) ? reportData.dias : [];
  const dayHeaders = dias.length ? dias.map(dia => `<th>${dia.label || dia.nombre_dia || 'Dia'}</th>`).join('') : '<th colspan="7">Sin dias</th>';

  if (!rows.length) {
    $(selector).html('<div class="alert alert-info m-b-0">No hay datos para mostrar en el reporte.</div>');
    return;
  }

  const body = rows.map((row, rowIndex) => {
    const mapDias = (collection, accessor) => dias.map(dia => {
      const detailDay = (collection || []).find(item => parseInt(item.dia_semana, 10) === parseInt(dia.dia_semana, 10)) || {};
      return `<td>${accessor(detailDay)}</td>`;
    }).join('');

    return `
      <tr>
        <td rowspan="3">${rowIndex + 1}</td>
        <td rowspan="3">${row.ficha || ''}</td>
        <td rowspan="3">${row.trabajador || ''}</td>
        <td><strong>TN</strong></td>
        ${mapDias(row.dias, dia => parseFloat(dia.horas_normales || 0).toFixed(2))}
        <td>${parseFloat(row.tn || 0).toFixed(2)}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td><strong>TE</strong></td>
        ${mapDias(row.dias, dia => parseFloat(dia.horas_extra || 0).toFixed(2))}
        <td></td>
        <td>${parseFloat(row.hes || 0).toFixed(2)}</td>
        <td>${parseFloat(row.hdo || 0).toFixed(2)}</td>
        <td>${parseFloat(row.hd || 0).toFixed(2)}</td>
        <td>${parseFloat(row.ht || 0).toFixed(2)}</td>
      </tr>
      <tr>
        <td><strong>PROY</strong></td>
        ${mapDias(row.dias, dia => dia.numero_proyecto || '')}
        <td colspan="5">${row.observaciones || ''}</td>
      </tr>
    `;
  }).join('');

  $(selector).html(`
    <table class="table table-bordered table-sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Ficha</th>
          <th>Trabajador</th>
          <th>Tipo</th>
          ${dayHeaders}
          <th>TN</th>
          <th>HES</th>
          <th>HDO</th>
          <th>HD</th>
          <th>HT</th>
        </tr>
      </thead>
      <tbody>${body}</tbody>
    </table>
  `);
}

function compareTrabajadores(a, b) {
  return [
    a.apellido_paterno || '',
    a.apellido_materno || '',
    a.nombre || ''
  ].join(' ').localeCompare([
    b.apellido_paterno || '',
    b.apellido_materno || '',
    b.nombre || ''
  ].join(' '), 'es', { sensitivity: 'base' });
}

function sortReportRows(rows) {
  return rows.slice().sort((a, b) => {
    const aKey = [
      a.apellido_paterno || a.trabajador_apellido_paterno || '',
      a.apellido_materno || a.trabajador_apellido_materno || '',
      a.nombre || a.trabajador_nombre || a.trabajador || ''
    ].join(' ');
    const bKey = [
      b.apellido_paterno || b.trabajador_apellido_paterno || '',
      b.apellido_materno || b.trabajador_apellido_materno || '',
      b.nombre || b.trabajador_nombre || b.trabajador || ''
    ].join(' ');

    return aKey.localeCompare(bKey, 'es', { sensitivity: 'base' });
  });
}

function formatDayLabel(date) {
  return date.toLocaleDateString('es-MX', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit'
  });
}

function formatDateInput(value) {
  if (!value) return '';
  if (typeof value === 'string' && value.length >= 10) return value.substring(0, 10);
  return value;
}

function parseLocalDate(value) {
  if (!value) return null;

  if (value instanceof Date) return clearTime(value);

  const normalized = String(value).trim().substring(0, 10).replace(/\//g, '-');
  let parts = normalized.split('-').map(part => parseInt(part, 10));
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;

  if (parts[0] > 31) {
    return clearTime(new Date(parts[0], parts[1] - 1, parts[2]));
  }

  return clearTime(new Date(parts[2], parts[1] - 1, parts[0]));
}

function clearTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getFirstValue(obj, keys) {
  const key = keys.find(item => obj[item] !== undefined && obj[item] !== null && obj[item] !== '');
  return key ? obj[key] : null;
}

function isTruthy(value) {
  return value === true || value === 1 || value === '1' || String(value).toLowerCase() === 'true' || String(value).toLowerCase() === 'si';
}

function containsWeekNumber(value, week) {
  if (!value) return false;
  return new RegExp(`(^|\\D)${week}(\\D|$)`).test(String(value));
}

function getIsoWeekNumber(date) {
  const current = clearTime(date);
  current.setDate(current.getDate() + 4 - (current.getDay() || 7));

  const yearStart = new Date(current.getFullYear(), 0, 1);
  return Math.ceil((((current - yearStart) / 86400000) + 1) / 7);
}

function getSundayWeekNumber(date) {
  const yearStart = new Date(date.getFullYear(), 0, 1);
  return Math.floor(((clearTime(date) - yearStart) / 86400000 + yearStart.getDay()) / 7) + 1;
}

function getMondayWeekNumber(date) {
  const yearStart = new Date(date.getFullYear(), 0, 1);
  const yearStartDay = yearStart.getDay() || 7;
  return Math.floor(((clearTime(date) - yearStart) / 86400000 + yearStartDay - 1) / 7) + 1;
}

function toYmd(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}
