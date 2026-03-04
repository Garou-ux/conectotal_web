$(document).ready(function () {
    getDataControl('/trabajadores/getData', function (data) {
        const titulo = data ? 'Editar Empleado' : 'Nuevo Empleado';
        $('#titulo').text(titulo);
        console.log(data.data)
        console.log(data.data.cat_areas)
        $("#supervisor_id").populateSelect({
            obj: data.data.supervisores, 
            map: { value: "id", text: ["nombre"] },
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
        apiPath: '/trabajadores/setData',
        validation: {
        },
        onSuccess: () => {
            alert('Guardado correctamente');
            ERP.navegarAModulo('trabajadores');
        },
        onError: (err) => {
            console.error('Error al guardar:', err);
            alert('Error al guardar. Ver consola.');
        }
    });

    ERP.controlesDiv();

    $('#buttonCerrar').click(function(){
        ERP.navegarAModulo('trabajadores');
    })

         const select2Rendered = document.querySelector(".select2-selection__rendered");
        if (select2Rendered) {
            select2Rendered.style.backgroundColor = "#fff"; // tu color aquí
        }
});
