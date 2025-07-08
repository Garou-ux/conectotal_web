console.log('Módulo facturas.js inicializado');

$(document).ready(function () {
  // Cargar datos
  cargarFacturas();

  // Evento de nuevo
  $('#btnNuevaFactura').on('click', function () {
    alert('Abrir modal o formulario para nueva factura');
  });
});

function cargarFacturas() {
  // Simulación (en práctica, AJAX a tu API Laravel)
  const datos = [
    { folio: 'F001', cliente: 'Empresa A', total: '$7,000.00', fecha: '2025-06-29' },
    { folio: 'F002', cliente: 'Empresa B', total: '$5,500.00', fecha: '2025-06-28' }
  ];

  const html = datos.map(f =>
    `<tr>
      <td>${f.folio}</td>
      <td>${f.cliente}</td>
      <td>${f.total}</td>
      <td>${f.fecha}</td>
      <td><button class="btn btn-sm btn-info">Ver</button></td>
    </tr>`
  ).join('');

  $('#tablaFacturas').html(html);
}
