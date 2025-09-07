(function($) {
    $.fn.populateSelect = function(options) {
        const settings = $.extend({
            obj: [],
            map: { value: "id", text: ["descripcion"] },
            empty: false,
            search: false,
            callback: null
        }, options);

        return this.each(function() {
            const $select = $(this);

            // Limpiar opciones previas
            $select.empty();

            // Opción vacía si se solicita
            if (settings.empty) {
                $select.append($("<option>", { value: "" }).text("-- Selecciona --"));
            }

            // Poblar opciones
            settings.obj.forEach(item => {
                const value = item[settings.map.value];
                const text = settings.map.text.map(key => item[key]).join(" - ");
                $select.append($("<option>", { value: value }).text(text));
            });

            // Destruir select2 si ya existía
            if ($select.data("select2")) {
                $select.select2("destroy");
            }

            // Activar select2 si search = true
            if (settings.search) {
                $select.select2({ width: "100%" });
            }

            // Evento de cambio -> callback
            if (typeof settings.callback === "function") {
                $select.off("change.populateSelect").on("change.populateSelect", function() {
                    const selectedId = $(this).val();
                    const selectedObj = settings.obj.find(itm => itm[settings.map.value] == selectedId);
                    settings.callback(selectedObj, selectedObj || {});
                });
            }
        });
    };
})(jQuery);
