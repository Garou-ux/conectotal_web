console.log('Módulo clientes.js inicializado');

$(document).ready(function () {
  var grid = new JsGridComponent(
    'jsGrid',
    '/clientes/getDataGridParams',
    '/clientes/getGridData',
    'cliente_alta',
        {
      labelNuevo: 'Nuevo Cliente',
      enableDateRange: true,
      onDataLoaded: (datos) => {
        console.log('Total clientes cargados:', datos.length);
        // aquí puedes generar KPIs o resumen
      }
    }
  );

  // grid.init(function (datos) {
  //   console.log(datos);
  // });
  grid.init();
  ERP.controlesDiv();

});
