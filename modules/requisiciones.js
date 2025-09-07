
$(document).ready(function () {  
  const grid = new DataTableComponent(
    'res-config',
    '/requisiciones/getDataGridParams',
    '/requisiciones/getGridData',
    'requisicion_alta',
    {
      labelNuevo: 'Nueva Requisicion',
      enableDateRange: true,
      headerClass: 'table-custom-header'
    }
  );

  grid.init(function (datos) {
        
  });


});
