var tableConceptos;
var gastos_viaje = $("#requisiciones");

$(document).ready(function () {
    getDataControl('/cotizacionesProveedores/getData', function (data) {
        const titulo = data ? 'Editar Requisicion' : 'Nueva Requisicion';
        $('#titulo').text(titulo);
        console.log(data.data.data.productos)
        $("#producto_id_table").populateSelect({
            obj: data.data.data.productos,
            map: { value: "id", text: ["descripcion"] },
            empty: true,
            search: false,
            callback: function(itm, obj) {
                console.log("Seleccionado:", obj);
            }
        });

        $("#proveedor_id").populateSelect({
            obj: data.data.data.proveedores,
            map: { value: "id", text: ["razon_social"] },
            empty: true,
            search: false,
            callback: function(itm, obj) {
                console.log("Seleccionado:", obj);
            }
        });


        tableConceptos = new tableControl({
            table: $("#tableDetalles"),
            form: $("#formDetalles"),
            addButton: $("#addConceptos"),
            key: 'id',
            tableObj: data.data.data.detalles,
            columns: [
                { key: 'producto_id', field: $("#producto_id_table") },
                { key: 'cantidad', field: $("#cantidad_table") },
                { key: 'descripcion', field: $("#descripcion_table")},
                { key: 'valor_unitario', field: $("#valor_unitario_table") },
                { key: 'importe', field: $("#importe_table") },
                { key: 'descuento', field: $("#descuento_table") },
                { key: 'iva', field: $("#iva_table") },
                { key: 'total', field: $("#total_table") },
            ],
            callback: (data, summary) => {
                console.log('Tabla actualizada', data);
                    let subTotal = 0, iva = 0, total = 0;

                    data.forEach(row => {
                        subTotal += parseFloat(row.importe);
                        iva += parseFloat(row.iva);
                        total += parseFloat(row.total);
                    });

                    console.log('SubTotal:', subTotal.toFixed(2));
                    console.log('IVA:', iva.toFixed(2));
                    console.log('Total:', total.toFixed(2));

                    // Si quieres, puedes actualizar los hidden inputs también
                    document.querySelector("#subtotal").value = subTotal.toFixed(2);
                    document.querySelector("#iva").value = iva.toFixed(2);
                    document.querySelector("#total").value = total.toFixed(2);
            },
            addCallback:(row) => {
                console.log('fila', row);
                recalcularTotales();
                limpiarTotales();
            }
        });
        
        MainFiller.fill(data.data.data.data);

    });

    submitForm({
        formId: 'formController',
        apiPath: '/cotizacionesProveedores/setData',
        validation: {
        },
        callbackExtraParams: function(formData) {
            return {
            detalle: tableConceptos.tableObj,
            };
        },
        onSuccess: () => {
            alert('Guardado correctamente');
            ERP.navegarAModulo('cotizaciones_proveedores');
        },
        onError: (err) => {
            console.error('Error al guardar:', err);
            alert('Error al guardar.');
        }
    });

    ERP.controlesDiv();

    $('#buttonCerrar').click(function(){
        ERP.navegarAModulo('cotizaciones_proveedores');
    });

    function recalcularFila(input) {
    const rowEl = input.closest("tr");
    if (!rowEl) return;

    const ivaPct = 16; // porcentaje de IVA

    let cantidad = parseFloat(rowEl.querySelector(".cantidad_table")?.value) || 0;
    let valorUnitario = parseFloat(rowEl.querySelector(".valor_unitario_table")?.value) || 0;
    let importe = parseFloat(rowEl.querySelector(".importe_table")?.value) || 0;
    let descuento = parseFloat(rowEl.querySelector(".descuento_table")?.value) || 0;

    // Si se editó el importe directamente, recalcular cantidad
    if (input.classList.contains("importe_table") && valorUnitario > 0) {
        cantidad = importe / valorUnitario;
        rowEl.querySelector(".cantidad_table").value = cantidad.toFixed(2);
    } else {
        importe = cantidad * valorUnitario;
        rowEl.querySelector(".importe_table").value = importe.toFixed(2);
    }

    const iva = (importe - descuento) * (ivaPct / 100);
    const total = (importe - descuento) + iva;

    rowEl.querySelector(".iva_table").value = iva.toFixed(2);
    rowEl.querySelector(".total_table").value = total.toFixed(2);


    }

    function recalcularTotales() {
    let subTotal = 0, iva = 0, total = 0;

    document.querySelectorAll(".formDetalles").forEach(tr => {
        const importe = parseFloat(tr.querySelector(".importe_table")?.value) || 0;
        const ivaVal = parseFloat(tr.querySelector(".iva_table")?.value) || 0;
        const totalVal = parseFloat(tr.querySelector(".total_table")?.value) || 0;

        subTotal += importe;
        iva += ivaVal;
        total += totalVal;
    });

    document.querySelector("#subtotal").value = subTotal.toFixed(2);
    document.querySelector("#iva").value = iva.toFixed(2);
    document.querySelector("#total").value = total.toFixed(2);
    }

    function limpiarTotales(){
        document.querySelectorAll(".formDetalles").forEach(tr => {
            tr.querySelector(".importe_table").value = 0;
            tr.querySelector(".iva_table").value = 0;
            tr.querySelector(".total_table").value = 0;
            tr.querySelector(".descuento_table").value = 0;
            tr.querySelector(".valor_unitario_table").value = 0;
    });
    }

    // asignar eventos a todos los inputs editables
    document.querySelectorAll(".formDetalles").forEach(tr => {
    tr.querySelectorAll(".cantidad_table, .valor_unitario_table, .importe_table, .descuento_table")
        .forEach(input => input.addEventListener("blur", e => recalcularFila(e.target)));
    });

    gastos_viaje.click(function() {
        if($(this).prop( "checked")){
            //gastosenc.show();
            $(this).createCheckList({
                api: '/requisiciones/getRequisicionesForCotizacion',
                map: {
                    'requisicion_id': '# Requisicion',
                    'fecha': 'Fecha requisicion',
                    'producto_id': 'Producto',
                    'cantidad': 'Cantidad Solicitada',
                    'descripcion': 'Descripcion',
                    'observacion': 'Observaciones',
                },
                key: 'requisicion_id',
                callback: function(obj){
                    console.log(obj);
                    tableConceptos.tableObj = obj.obj;
                    tableConceptos.redraw();
                }
            });
        }else{
            //gastosenc.hide();
        }
    });


});
