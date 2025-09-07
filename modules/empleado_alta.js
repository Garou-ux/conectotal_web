$(document).ready(function () {
    getDataControl('/plantillas/getData', function (data) {
        const titulo = data ? 'Editar Empleado' : 'Nuevo Empleado';
        $('#titulo').text(titulo);
        console.log(data.data)
        console.log(data.data.cat_areas)
        $("#cat_area_id").populateSelect({
            obj: data.data.cat_areas,    // tu array de áreas
            map: { value: "id", text: ["descripcion"] },
            empty: true,
            search: false, // esto lo hace Select2
            callback: function(itm, obj) {
                console.log("Seleccionado:", obj);
                // cargar dinámicamente el segundo select
            }
        });

        MainFiller.fill(data.data.data);
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

         const select2Rendered = document.querySelector(".select2-selection__rendered");
        if (select2Rendered) {
            select2Rendered.style.backgroundColor = "#fff"; // tu color aquí
        }
});
