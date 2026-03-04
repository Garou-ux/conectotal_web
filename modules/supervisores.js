
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
    '/supervisores/getDataGridParams',
    '/supervisores/getGridData',
    'supervisor_alta',
    {
      labelNuevo: 'Nuevo Supervisor',
      enableDateRange: false,
      headerClass: 'table-custom-header'
    }
  );

  grid.init(function (datos) {
    // console.log('Datos cargados:', datos);
  });


});
