/**
 * TabulatorGrid - Componente modular reusable
 * Patron de diseño: Prototype
 * Uso: TabulatorGrid.init('id', 'urlColumnas', 'urlDatos')
 */

const TabulatorGrid = (function () {
  function TabulatorGrid() {}

  TabulatorGrid.prototype.init = function (targetId, urlColumnas, urlDatos) {
    const self = this;
    const container = document.getElementById(targetId);

    if (!container) {
      console.error(`Elemento con id '${targetId}' no encontrado.`);
      return;
    }

    container.innerHTML = '<div class="text-center">Cargando tabla...</div>';

    $.get(urlColumnas)
      .done(function (columnasApi) {
        const columnasTabulator = columnasApi.map(col => {
          let columna = {
            title: col.caption,
            field: col.dataField,
            headerFilter: true
          };

          if (col.dataType === 'date') {
            columna.formatter = "datetime";
            columna.formatterParams = {
              inputFormat: "YYYY-MM-DD",
              outputFormat: "DD/MM/YYYY",
              invalidPlaceholder: "--"
            };
          }

          if (col.dataType === 'number') {
            columna.hozAlign = "right";
            columna.formatter = "money";
            columna.formatterParams = {
              thousand: ",",
              decimal: ".",
              precision: 2
            };
          }

          if (col.actions === true) {
            columna.formatter = (cell) => {
              return `
                <button class='btn btn-sm btn-primary edit-row'>Editar</button>
                <button class='btn btn-sm btn-danger delete-row'>Eliminar</button>`;
            };
            columna.cellClick = function (e, cell) {
              const rowData = cell.getRow().getData();
              if (e.target.classList.contains('edit-row')) {
                alert('Editar: ' + JSON.stringify(rowData));
              } else if (e.target.classList.contains('delete-row')) {
                alert('Eliminar: ' + JSON.stringify(rowData));
              }
            };
          }

          return columna;
        });

        $.get(urlDatos)
          .done(function (data) {
            const table = new Tabulator(`#${targetId}`, {
              layout: "fitColumns",
              responsiveLayout: "collapse",
              pagination: true,
              paginationSize: 10,
              height: "500px",
              columns: columnasTabulator,
              data: data,
              movableColumns: true,
              resizableRows: true,
              locale: true,
              langs: {
                "default": {
                  "pagination": {
                    "first": "Primero",
                    "first_title": "Primera Página",
                    "last": "Último",
                    "last_title": "Última Página",
                    "prev": "Anterior",
                    "prev_title": "Página Anterior",
                    "next": "Siguiente",
                    "next_title": "Página Siguiente"
                  }
                }
              },
              footerElement: "<button id='exportExcel' class='btn btn-success btn-sm'>Exportar Excel</button>"
            });

            document.getElementById("exportExcel").addEventListener("click", function () {
              table.download("xlsx", "datos.xlsx", { sheetName: "Export" });
            });

          })
          .fail(() => {
            container.innerHTML = '<div class="alert alert-danger">Error al cargar datos.</div>';
          });

      })
      .fail(() => {
        container.innerHTML = '<div class="alert alert-danger">Error al cargar columnas.</div>';
      });
  };

  return new TabulatorGrid();
})();

// Uso:
// TabulatorGrid.init('tablaClientes', '/api/clientes/columnas', '/api/clientes/datos');
