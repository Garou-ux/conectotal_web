function getDataControl(apiPath, onSuccess = () => {}) {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id')) || 0;

  // Hacer la petición aunque el ID sea 0 (nuevo)
  Api.post(apiPath, { id }).then(response => {
    const data = response?.data?.data || null;

    // Llenado automático solo si hay datos
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        const $field = $(`#formController [name="${key}"], #formController [id="${key}"]`);

        if ($field.length) {
          const tag = $field.prop('tagName').toLowerCase();
          const type = $field.attr('type');

          if (tag === 'input' || tag === 'textarea') {
            if (type === 'checkbox') {
              $field.prop('checked', !!value);
            } else {
              $field.val(value);
            }
          } else if (tag === 'select') {
            $field.val(value).change();
          }
        }
      });
    }

    onSuccess(data);
  }).catch(err => {
    console.error('Error en getDataControl:', err);
  });
}
