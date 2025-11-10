function submitForm({
  formId,
  apiPath,
  validation = {},
  onSuccess = () => {},
  onError = () => {},
  callbackExtraParams = () => ({}),
  confirmAlert = false,
  confirmMessage = '¿Deseas continuar?',
  validateArrays = null
}) {
  const $form = $(`#${formId}`);

  $form.on('submit', function (e) {
    e.preventDefault();

    let userConfirmed = null; // null = no aplica

    // Confirmación opcional (pero no bloquea envío)
    if (confirmAlert && confirmMessage) {
      userConfirmed = confirm(confirmMessage); // true o false
    }

    // Validación de campos simples
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
        return;
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

    // Agregar confirmación (aunque sea null)
    formData['__confirm'] = userConfirmed;

    // Combinar con parámetros extra
    const extraParams = callbackExtraParams(formData);
    $.extend(formData, extraParams);

    // Validar arrays (si existe callback)
    if (typeof validateArrays === 'function') {
      const arraysValid = validateArrays(formData);
      if (!arraysValid) return;
    }

    // Enviar los datos
    Api.post(apiPath, formData)
      .then(onSuccess)
      .catch(onError);
  });
}
