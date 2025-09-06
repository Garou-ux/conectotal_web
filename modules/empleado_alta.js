$(document).ready(function () {
    getDataControl('/plantillas/getData', function (data) {
        const titulo = data ? 'Editar Empleado' : 'Nuevo Empleado';
        $('#titulo').text(titulo);
        console.log(data)
    });

    submitForm({
        formId: 'formController',
        apiPath: '/plantillas/setData',
        validation: {
        },
        onSuccess: () => {
            alert('Guardado correctamente');
            ERP.navegarAModulo('empleados');
        },
        onError: (err) => {
            console.error('Error al guardar:', err);
            alert('Error al guardar. Ver consola.');
        }
    });

    ERP.controlesDiv();

    $('#buttonCerrar').click(function(){
        ERP.navegarAModulo('empleados');
    })

});
