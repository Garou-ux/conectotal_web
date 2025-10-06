(function($) {
  $.fn.setAutoComplete = function(config) {
    let elem = $(this);
    let listBtn = $("#" + elem.attr("id") + "_list");

    // === Abrir modal de búsqueda ===
    listBtn.on("click", function() {
      let modal = $("#autocompleteModal");
      let table = modal.find("table tbody");
      let btnAceptar = $("#buttonAceptar");

      table.empty();
      $("#filterMS_input").val("");

      // Llamada inicial a la API
      Api.post(config.api, {
        target: config.target,
        text: '',
        extras: config.extras || ''
      }).then(data => {
        table.empty();
        console.log(data)
        $.each(data.data, function(i, v) {
          let tr = $("<tr>")
            .attr("data-id", v[config.valueField])
            .attr("data-text", v[config.textField])
            .css("cursor", "pointer")
            .append($("<td>").text(v[config.textField]));

          tr.on("click", function() {
            table.find("tr").removeClass("table-success");
            $(this).addClass("table-success").attr("data-selected", "true");
          });

          tr.on("dblclick", function() {
            btnAceptar.trigger("click");
          });

          table.append(tr);
        });

        // Filtrar en tiempo real
        $("#filterMS_input").off("keyup").on("keyup", function() {
          let val = $(this).val().toLowerCase();
          table.find("tr").each(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
          });
        });

        // Botón aceptar
        btnAceptar.off("click").on("click", function() {
          let selected = table.find("tr.table-success");
          if (selected.length) {
            elem.val(selected.data("text"));
            $("#" + config.hiddenField).val(selected.data("id"));

            if (typeof config.callback === "function") {
              config.callback({
                id: selected.data("id"),
                text: selected.data("text")
              });
            }

            modal.modal("hide");
          }
        });

        modal.modal("show");
      });
    });

    // === Autocomplete inline ===
    elem.autocomplete({
      minLength: 2,
      delay: 400,
      source: function(request, response) {
        Api.post(config.api, {
          target: config.target,
          text: request.term,
          extras: config.extras || ''
        }).then(data => {
            console.log(data)
          response($.map(data.data, function(item) {
            return {
              label: item[config.textField],
              value: item[config.textField],
              id: item[config.valueField]
            };
          }));
        });
      },
      select: function(event, ui) {
        elem.val(ui.item.value);
        $("#" + config.hiddenField).val(ui.item.id);

        if (typeof config.callback === "function") {
          config.callback(ui.item);
        }

        return false;
      }
    });
  };
})(jQuery);
