$(document).ready(function () {
  const grid = new DataTableComponent(
    'res-config',
    '/plantillaProyectos/getDataGridParams',
    '/plantillaProyectos/getGridData',
    'plantilla_proyecto_alta',
    {
      labelNuevo: 'Nueva Plantilla',
      enableDateRange: false,
      headerClass: 'table-custom-header',
      extraActions: [
        {
          className: 'btn-info',
          title: 'Ver reporte',
          text: '📄',
          onClick: (row) => ERP.navegarAModulo('plantilla_proyecto_reporte', row.id)
        }
      ]
    }
  );

  grid.init(function (datos) {
    const rows = Array.isArray(datos) ? datos : [];
    const totalPlantillas = rows.length;
    const totalTrabajadores = rows.reduce((acc, item) => acc + (parseInt(item.trabajadores, 10) || 0), 0);
    const totalHoras = rows.reduce((acc, item) => acc + (parseFloat(item.total_tn) || 0), 0);

    $('#ppTotalPlantillas').text(totalPlantillas);
    $('#ppTotalTrabajadores').text(totalTrabajadores);
    $('#ppTotalHoras').text(totalHoras.toFixed(2));
  });

  ERP.controlesDiv();
});
