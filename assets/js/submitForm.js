function submitForm({
  formId,
  apiPath,
  validation = {},
  onSuccess = () => {},
  onError = () => {},
  callbackExtraParams = () => ({})
}) {
  const $form = $(`#${formId}`);

  $form.on('submit', function (e) {
    e.preventDefault();

    // Validación personalizada por campo
    for (const field in validation) {
      const $input = $form.find(`[name="${field}"]`);
      const rule = validation[field];
      const value = $input.val();

      const isValid = rule.eval
        ? Function('value', `return ${rule.eval}`)(value)
        : value && value.trim() !== '';

      if (!isValid) {
        alert(rule.label || `El campo ${field} es obligatorio`);
        $input.focus();
        return; // Detener envío
      }
    }

    // Construir formData
    const formData = {};
    const formArray = $form.serializeArray();

    formArray.forEach(({ name, value }) => {
      const $field = $form.find(`[name="${name}"]`);
      const type = $field.attr('type');

      if (type === 'checkbox') {
        formData[name] = $field.prop('checked') ? 1 : 0;
      } else if (type === 'radio') {
        const selected = $form.find(`[name="${name}"]:checked`);
        formData[name] = selected.length ? selected.val() : null;
      } else {
        formData[name] = value;
      }
    });

    // Incluir ID si existe
    const id = $form.find('#id').val();
    if (id && parseInt(id) > 0) {
      formData['id'] = parseInt(id);
    }

    // Combinar con parámetros extra
    const extraParams = callbackExtraParams(formData);
    $.extend(formData, extraParams); // Extiende formData con los extras

    // Enviar los datos a la API
    Api.post(apiPath, formData)
      .then(onSuccess)
      .catch(onError);
  });
}
