$(document).ready(function () {  
  const grid = new DataTableComponent(
    'res-config',
    '/proyectos/getDataGridParams',
    '/proyectos/getGridData',
    'proyecto_alta',
    {
      labelNuevo: 'Nuevo Proyecto',
      enableDateRange: true,
      headerClass: 'table-custom-header'
    }
  );

  grid.init(function (datos) {
    console.log('Datos cargados:', datos);
  });


});
