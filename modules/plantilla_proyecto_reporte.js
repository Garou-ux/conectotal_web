$(document).ready(function () {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10) || 0;

  if (!id) {
    $('#reporteTableContainer').html('<div class="alert alert-warning">No se proporcionó un ID de plantilla.</div>');
    return;
  }

  Api.post('/plantillaProyectos/getReporteData', { id }).then(function (response) {
    const data = response.data || {};
    renderPlantillaReporteHeader(data.encabezado || {});
    renderPlantillaReporteBody(data);
  }).catch(function (err) {
    console.error('Error cargando reporte:', err);
    $('#reporteTableContainer').html('<div class="alert alert-danger">No se pudo cargar el reporte.</div>');
  });

  $('#buttonImprimirReporte').click(function () {
    window.print();
  });

  $('#buttonEditarPlantilla').click(function () {
    ERP.navegarAModulo('plantilla_proyecto_alta', id);
  });

  $('#buttonCerrarReporte').click(function () {
    ERP.navegarAModulo('plantilla_proyectos');
  });
});

function renderPlantillaReporteHeader(header) {
  $('#reporteSubtitulo').text(`Supervisor: ${header.supervisor || 'N/D'} | Semana ${header.semana || 'N/D'}`);
  $('#reporteHeader').html(`
    <div class="row">
      <div class="col-md-3"><strong>Supervisor:</strong><br>${header.supervisor || ''}</div>
      <div class="col-md-2"><strong>Año:</strong><br>${header.anio || ''}</div>
      <div class="col-md-2"><strong>Mes:</strong><br>${header.mes || ''}</div>
      <div class="col-md-2"><strong>Semana:</strong><br>${header.semana || ''}</div>
      <div class="col-md-3"><strong>Proyecto base:</strong><br>${header.numero_proyecto || ''}</div>
    </div>
    <div class="row m-t-10">
      <div class="col-md-6"><strong>Inicio:</strong> ${header.fecha_inicio || ''}</div>
      <div class="col-md-6"><strong>Fin:</strong> ${header.fecha_fin || ''}</div>
    </div>
  `);
}

function renderPlantillaReporteBody(reportData) {
  const rows = sortReporteTrabajadores(Array.isArray(reportData.rows) ? reportData.rows : []);
  const dias = Array.isArray(reportData.dias) ? reportData.dias : [];

  if (!rows.length) {
    $('#reporteTableContainer').html('<div class="alert alert-info">No hay detalle para este reporte.</div>');
    return;
  }

  const dayHeaders = dias.map(dia => `<th>${dia.label || 'Dia'}</th>`).join('');

  const body = rows.map((row, rowIndex) => {
    const findDay = (diaSemana) => (row.dias || []).find(item => parseInt(item.dia_semana, 10) === parseInt(diaSemana, 10)) || {};

    const normalCells = dias.map(dia => `<td>${parseFloat(findDay(dia.dia_semana).horas_normales || 0).toFixed(2)}</td>`).join('');
    const extraCells = dias.map(dia => `<td>${parseFloat(findDay(dia.dia_semana).horas_extra || 0).toFixed(2)}</td>`).join('');
    const proyectoCells = dias.map(dia => `<td>${findDay(dia.dia_semana).numero_proyecto || ''}</td>`).join('');

    return `
      <tr>
        <td rowspan="3">${rowIndex + 1}</td>
        <td rowspan="3">${row.ficha || ''}</td>
        <td rowspan="3">${row.trabajador || ''}</td>
        <td><strong>TN</strong></td>
        ${normalCells}
        <td>${parseFloat(row.tn || 0).toFixed(2)}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td><strong>TE</strong></td>
        ${extraCells}
        <td></td>
        <td>${parseFloat(row.hes || 0).toFixed(2)}</td>
        <td>${parseFloat(row.hdo || 0).toFixed(2)}</td>
        <td>${parseFloat(row.hd || 0).toFixed(2)}</td>
        <td>${parseFloat(row.ht || 0).toFixed(2)}</td>
      </tr>
      <tr>
        <td><strong>PROY</strong></td>
        ${proyectoCells}
        <td colspan="5">${row.observaciones || ''}</td>
      </tr>
    `;
  }).join('');

  $('#reporteTableContainer').html(`
    <table class="table table-striped table-bordered table-sm">
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

function sortReporteTrabajadores(rows) {
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
