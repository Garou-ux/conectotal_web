console.log('Módulo clientes.js inicializado');

$(document).ready(function () {
//   var grid = new JsGridComponent(
//     'jsGrid',
//     '/clientes/getDataGridParams',
//     '/clientes/getGridData',
//     'cliente_alta',
//     {
//       labelNuevo: 'Nuevo Cliente',
//       enableDateRange: true,
//     }
//   );

// grid.init(function (datos) {
//   console.log('Datos cargados:', datos);
//   // Puedes usar aquí para tus KPIs, cards, etc.
// });
//   ERP.controlesDiv();


  // $('#res-config').DataTable({
  //     responsive: true
  // });
  
  const grid = new DataTableComponent(
    'res-config',
    '/clientes/getDataGridParams',
    '/clientes/getGridData',
    'cliente_alta',
    {
      labelNuevo: 'Nuevo Cliente',
      enableDateRange: false,
      headerClass: 'table-custom-header' // aquí nombras la clase
    }
  );

  grid.init(function (datos) {
    console.log('Datos cargados:', datos);
    // aquí puedes actualizar KPIs, cards, etc.
  });


});
