console.log('Módulo facturas.js inicializado');

$(document).ready(function () {
ERP.initFacturas = function () {
  console.log('🔥 Facturas inicializado');

  $('#btnNuevaFactura').on('click', function () {
    alert('Abrir modal para nueva factura');
  });

  // Aquí puedes cargar datos, iniciar DataTables, etc.
};

});

