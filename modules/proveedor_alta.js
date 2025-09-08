$(document).ready(function () {
    getDataControl('/proveedores/getData', function (data) {
        const titulo = data ? 'Editar Proveedor' : 'Nuevo Proveedor';
        $('#titulo').text(titulo);
        MainFiller.fill(data.data.data);
    });

    submitForm({
        formId: 'formController',
        apiPath: '/proveedores/setData',
        validation: {
            nombre: {
                label: 'Se requiere el nombre',
                eval: "value.trim().length > 0"
            },
        },
        onSuccess: () => {
            alert('Guardado correctamente');
            ERP.navegarAModulo('proveedores');
        },
        onError: (err) => {
            console.error('Error al guardar:', err);
            alert('Error al guardar. Ver consola.');
        }
    });

    ERP.controlesDiv();

    $('#buttonCerrar').click(function(){
        ERP.navegarAModulo('proveedores');
    })

});
