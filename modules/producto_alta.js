$(document).ready(function () {
    getDataControl('/productos/getData', function (data) {
        const titulo = data ? 'Editar Producto' : 'Nuevo Producto';
        $('#titulo').text(titulo);
        console.log(data)
    });

    submitForm({
        formId: 'formController',
        apiPath: '/productos/setData',
        validation: {
            clave: {
                label: 'Se requiere la clave',
                eval: "value.trim().length > 0"
            },
        },
        onSuccess: () => {
            alert('Guardado correctamente');
            ERP.navegarAModulo('productos');
        },
        onError: (err) => {
            console.error('Error al guardar:', err);
            alert('Error al guardar. Ver consola.');
        }
    });

    ERP.controlesDiv();

    $('#buttonCerrar').click(function(){
        ERP.navegarAModulo('productos');
    })

});
