var tableConceptos;


$(document).ready(function () {
    getDataControl('/requisiciones/getData', function (data) {
        const titulo = data ? 'Editar Requisicion' : 'Nueva Requisicion';
        $('#titulo').text(titulo);
        console.log(data.data.data)
        $("#producto_id_table").populateSelect({
            obj: data.data.data.productos,
            map: { value: "id", text: ["descripcion"] },
            empty: true,
            search: false,
            callback: function(itm, obj) {
                console.log("Seleccionado:", obj);
            }
        });

        $("#empleado_id").populateSelect({
            obj: data.data.data.empleados,
            map: { value: "id", text: ["descripcion"] },
            empty: true,
            search: false,
            callback: function(itm, obj) {
                console.log("Seleccionado:", obj);
            }
        });


        tableConceptos = new tableControl({
            table: $("#tableRequisicionDetalle"),
            form: $("#formRequisicionDetalle"),
            addButton: $("#addConceptos"),
            key: 'id',
            tableObj: data.data.data.detalles,
            columns: [
                { key: 'producto_id', field: $("#producto_id_table") },
                { key: 'cantidad', field: $("#cantidad_table") },
                { key: 'descripcion', field: $("#descripcion_table")},
                { key: 'observacion', field: $("#observacion_table") }
            ],
            callback: (data, summary) => {
                console.log('Tabla actualizada', data);
                console.log('Resumen', summary);
            },
            addCallback: row => console.log('Fila agregada', row)
        });
        
        MainFiller.fill(data.data.data.data);

    });

    submitForm({
        formId: 'formController',
        apiPath: '/requisiciones/setData',
        validation: {
        },
        callbackExtraParams: function(formData) {
            return {
            detalle: tableConceptos.tableObj,
            };
        },
        onSuccess: () => {
            alert('Guardado correctamente');
            ERP.navegarAModulo('requisiciones');
        },
        onError: (err) => {
            console.error('Error al guardar:', err);
            alert('Error al guardar. Ver consola.');
        }
    });

    ERP.controlesDiv();

    $('#buttonCerrar').click(function(){
        ERP.navegarAModulo('requisiciones');
    });

});
