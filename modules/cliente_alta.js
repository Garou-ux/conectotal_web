$(document).ready(function () {
    getDataControl('/clientes/getData', function (data) {
        const titulo = data ? 'Editar Cliente' : 'Nuevo Cliente';
        $('#titulo').text(titulo);
        console.log(data)
    });

    submitForm({
        formId: 'formController',
        apiPath: '/clientes/setData',
        validation: {
            nombre: {
                label: 'Se requiere el nombre',
                eval: "value.trim().length > 0"
            },
            email: {
                label: 'Correo inválido',
                eval: "/^[^@]+@[^@]+\\.[a-z]{2,}$/.test(value)"
            }
        },
        onSuccess: () => {
            alert('Guardado correctamente');
            ERP.navegarAModulo('clientes');
        },
        onError: (err) => {
            console.error('Error al guardar:', err);
            alert('Error al guardar. Ver consola.');
        }
    });

    ERP.controlesDiv();
});
