class MainFiller {
    static fill(data, formSelector = "#formController") {
        if (!data) return;

        Object.entries(data).forEach(([key, value]) => {
            const $field = $(`${formSelector} [name="${key}"], ${formSelector} [id="${key}"]`);

            if ($field.length) {
                const tag = $field.prop("tagName").toLowerCase();
                const type = ($field.attr("type") || "").toLowerCase();

                if (tag === "input" || tag === "textarea") {
                    if (type === "checkbox") {
                        $field.prop("checked", !!value);
                    } else {
                        $field.val(value);
                    }
                } else if (tag === "select") {
                    // soporta selects normales y select2
                    $field.val(value).trigger("change");
                }
            }
        });
    }
}
