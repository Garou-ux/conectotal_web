function currencyFormat(num, fix = 2){
    if($.isNumeric(num)){
        if(!num){
            num = 0;
        }
        num = parseFloat(num);
        return num.toFixed(fix).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }else{
        return num;
    }
}

function createDomElem(type,clases,propiedades){
    let elem = $(type);

    elem.addClass(clases);
    if(propiedades){
        elem.attr(propiedades);
    }

    return elem;
}


$.fn.extend({
    getBaseUrl: function () {
        return window.location.origin + "/api/";
    },

    customTooltip: function(params){
      elem = $(this);
      elem.attr('title','');
      var relleno = $("#tooltipzote").clone();
        elem.tooltip(
            {content: relleno.html()},
            {position: { my: "right-20 top-30 center", at: "right center",collision: "flip" } }
        );
        elem.tooltip('enable');
    },

    countriesControl: function(params){
        let pais = params.pais,
            estado = params.estado,
            estado_txt = params.estado_txt,
            municipio = params.municipio,
            municipio_txt = params.municipio_txt,
            colonia = params.colonia,
            localidad = params.localidad,
            codigoPostal = params.codigoPostal,
            paisSelected = params.paisSelected;


        switch (paisSelected) {
            case 'MEX':
                estado.obj.show();
                municipio.obj.show();
                colonia.obj.closest('div').show();
                localidad.obj.closest('div').show();
                estado_txt.obj.hide();
                municipio_txt.obj.hide();
                break;
            case 'USA':
                estado.obj.show();
                municipio.obj.hide();
                colonia.obj.closest('div').hide();
                localidad.obj.closest('div').hide();
                estado_txt.obj.hide();
                municipio_txt.obj.show();
                break;
            case 'CAN':
                estado.obj.show();
                municipio.obj.hide();
                colonia.obj.closest('div').hide();
                localidad.obj.closest('div').hide();
                estado_txt.obj.hide();
                municipio_txt.obj.show();
                break;
            default:
                estado.obj.hide();
                municipio.obj.hide();
                colonia.obj.closest('div').hide();
                localidad.obj.closest('div').hide();
                estado_txt.obj.show();
                municipio_txt.obj.show();
                break;
        }

        pais.obj.populateSelect({
            obj: pais.data,
            map: {
                value: 'clave',
                text: [
                    "descripcion"
                ]
            },
            empty: true,
            search: false,
            callback: function(itm,obj){
                switch (itm) {
                    case 'MEX':
                        estado.obj.show();
                        municipio.obj.show();
                        colonia.obj.closest('div').show();
                        localidad.obj.closest('div').show();
                        estado_txt.obj.hide();
                        municipio_txt.obj.hide();
                        break;
                    case 'USA':
                        estado.obj.show();
                        municipio.obj.hide();
                        colonia.obj.closest('div').hide();
                        localidad.obj.closest('div').hide();
                        estado_txt.obj.hide();
                        municipio_txt.obj.show();
                        break;
                    case 'CAN':
                        estado.obj.show();
                        municipio.obj.hide();
                        colonia.obj.closest('div').hide();
                        localidad.obj.closest('div').hide();
                        estado_txt.obj.hide();
                        municipio_txt.obj.show();
                        break;
                    default:
                        estado.obj.hide();
                        municipio.obj.hide();
                        colonia.obj.closest('div').hide();
                        localidad.obj.closest('div').hide();
                        estado_txt.obj.show();
                        municipio_txt.obj.show();
                        break;
                }
            },
            chTarget:[
                {
                    elem: estado.obj,
                    api: 'getEstadosPais',
                }
            ],
            clearField:[
                municipio.obj,
                localidad.obj,
                colonia.obj,
                codigoPostal.obj
            ]
        });

        estado.obj.populateSelect({
            obj: estado.data,
            map: {
                value: 'clave',
                text: [
                    "descripcion"
                ]
            },
            empty: true,
            search: false,
            chTarget:[
                {
                    elem: municipio.obj,
                    api: 'getMunicipiosEstado',
                },
                {
                    elem: localidad.obj,
                    api: 'getLocalidadesEstado',
                }
            ]
        });

        municipio.obj.populateSelect({
            obj: municipio.data,
            map: {
                value: 'clave',
                text: [
                    "descripcion"
                ]
            },
            empty: true,
            search: false,
        });

        colonia.obj.populateSelect({
            obj: colonia.data,
            map: {
                value: 'clave',
                text: [
                    "descripcion"
                ]
            },
            empty: true,
            search: false,
            wildcard:{
                text: 'No Aplica',
                value: '0000'
            }
        });

        localidad.obj.populateSelect({
            obj: localidad.data,
            map: {
                value: 'clave',
                text: [
                    "descripcion"
                ]
            },
            empty: true,
            search: false
        });
    },

    cpControl: function(params) {
        let elem = $(this);
        let pais = $("#"+params.pais);
        let municipio = $("#"+params.municipio);
        let estado = $("#"+params.estado);
        let localidad = $("#"+params.localidad);
        let colonia = $("#"+params.colonia);
        let api = "getCodigoPostal";

        elem.change(function(){
            if(pais.val() == 'MEX'){
                let data = {
                    codigoPostal: elem.val(),
                    pais: pais.val()
                }
                $.ajax({
                    method: "POST",
                    url: $(this).getBaseUrl()+api,
                    data: data
                })
                    .done(function( data, textStatus, jqXHR  ) {
                        let resp = data.data
                        estado.populateSelect({
                            obj: resp['satcat_estados'],
                            map: {
                                value: 'clave',
                                text: [
                                    "descripcion"
                                ]
                            },
                            empty: true,
                            search: false,
                            idSelected: resp.data.satcat_estados_clave
                        });

                        municipio.populateSelect({
                            obj: resp['satcat_municipios'],
                            map: {
                                value: 'clave',
                                text: [
                                    "descripcion"
                                ]
                            },
                            empty: true,
                            search: false,
                            idSelected: resp.data.satcat_municipios_clave

                        });

                        colonia.populateSelect({
                            obj: resp['satcat_colonias'],
                            map: {
                                value: 'clave',
                                text: [
                                    "descripcion"
                                ]
                            },
                            empty: true,
                            search: false,
                            idSelected: 0,
                            wildcard:{
                                text: 'No Aplica',
                                value: '0000'
                            }
                        });

                        localidad.populateSelect({
                            obj: resp['satcat_localidades'],
                            map: {
                                value: 'clave',
                                text: [
                                    "descripcion"
                                ]
                            },
                            empty: true,
                            search: false,
                            idSelected: resp.data.satcat_localidades_clave
                        });
                    })
                    .fail(function( jqXHR, textStatus, errorThrown ){
                        //alert((JSON.parse(jqXHR.responseText)).message);
                    })
            }
        });
    },

    submitForm: function (config){
        let form = $(this);
        form.submit(function (e) {
            console.log('Check'+checkSubmit);
            if(checkSubmit === false){
                if(!config.hasOwnProperty('afterValidation'))
                    checkSubmit = true;


                let api = config.api;
                let dat = form.getFormData();
                let error = false;
                dat['idRegistro'] = config.id;
                dat['__userId__'] = (typeof sessionStorage.getItem("userData") != 'null') ? JSON.parse( sessionStorage.getItem('userData') ).id : 0;

                if(config.hasOwnProperty('validation')){
                    $.each(config.validation,function(k,v){
                        if(!error) {
                            if(!form.find("#" + k).length){
                                return;
                            }
                            if (form.find("#" + k)[0].type == "select-one") {
                                let evalCond;
                                if(v.evalDefault){
                                    evalCond = (form.find("#" + k).val() == '' || form.find("#" + k).val() == null || form.find("#" + k).val() == v.eval);
                                }else{
                                    evalCond = (form.find("#" + k).val() == null || form.find("#" + k).val() == v.eval);
                                }
                                if (evalCond) {
                                    error = true;
                                    let tab = form.find("#" + k).closest('.tab-pane');
                                    if( tab ){
                                        if (tab.length > 0) {
                                            $("#" + tab[0].id + '-tab').click();
                                        }
                                    }

                                    $(document).Toasts('create', {
                                        title: v.label,
                                        class: 'bg-warning',
                                        autohide: true,
                                        delay: 2000,
                                        body: 'Por favor seleccione un ' + v.label + '.',
                                        position: 'bottomRight'
                                    });

                                    setTimeout(function(){
                                        let e = $.Event("keydown");
                                        e.which = 32; // # Some key code value
                                        form.find("#" + k).focus();
                                        setTimeout(function(){
                                            form.find("#" + k).trigger(e);
                                        },500)
                                    },500)
                                    checkSubmit = false;
                                }
                            } else {
                                if(form.find("#" + k)[0].nodeName == "TABLE"){
                                    let count = form.find("#" + k).find('tbody').find("tr:gt(0)").length;
                                    if(count < v.eval){
                                        error = true;
                                        let tab = form.find("#" + k).closest('.tab-pane');
                                        if( tab ){
                                            if (tab.length > 0) {
                                                $("#" + tab[0].id + '-tab').click();
                                            }
                                        }

                                        $(document).Toasts('create', {
                                            title: v.label,
                                            class: 'bg-warning',
                                            autohide: true,
                                            delay: 2000,
                                            body: 'La tabla ' + v.label + ' debe contener al menos '+ v.eval +' registros.',
                                            position: 'bottomRight'
                                        });
                                    }
                                    checkSubmit = false;
                                }else{
                                    if (form.find("#" + k).val() == v.eval || form.find("#" + k).val() == '') {
                                        error = true
                                        let tab = form.find("#" + k).closest('.tab-pane');
                                        if( tab ){
                                            if (tab.length > 0) {
                                                $("#" + tab[0].id + '-tab').click();
                                            }
                                        }

                                        $(document).Toasts('create', {
                                            title: v.label,
                                            class: 'bg-warning',
                                            autohide: true,
                                            delay: 2000,
                                            body: 'El campo ' + v.label + ' es requerido.',
                                            position: 'bottomRight'
                                        });

                                        setTimeout(function(){
                                            form.find("#" + k).focus();
                                        },500)
                                    }
                                    checkSubmit = false;
                                }
                            }
                        }
                    })
                }
                if(!error){
                    if(config.hasOwnProperty('afterValidation')){
                        if(config.afterValidation()){
                            e.preventDefault();
                            return;
                        }
                    }

                    if(config.hasOwnProperty('extra')){
                        $.extend(dat,config.extra);
                    };
                    if(config.hasOwnProperty('callbackExtraParams')){
                        $.extend(dat,config.callbackExtraParams(dat));
                    };
                    $.ajax({
                        method: "POST",
                        url: $(this).getBaseUrl()+api,
                        data: dat,
                        beforeSend: function(){
                            $(".loadOverlay").show();
                        }
                    })
                        .done(function( data, textStatus, jqXHR  ) {
                            if( !data.hasOwnProperty('error') ){
                                toastr.success("Datos guardados correctamente.");
                            }
                            if(config.hasOwnProperty('callback')){
                                config.callback(data);
                            }
                        })
                        .fail(function( jqXHR, textStatus, errorThrown ){
                            let obj = JSON.parse(jqXHR.responseText);
                            if(obj.data.hasOwnProperty('is_error')){
                                if(obj.data.is_error){
                                    toastr.warning(obj.data.error);
                                }
                            }else{
                                toastr.error("Ocurrio un error durante el guardado");
                            }
                        })
                        .always(function( jqXHR, textStatus, errorThrown ){
                            $(".loadOverlay").hide();
                            checkSubmit = false;
                        })
                }
                e.preventDefault();
            } else {
                toastr.warning('Ya se ha enviado la información, espere un momento.');
                e.preventDefault();
            }
        });
    },

    getFormData: function () {
        let objInp = $(this);

        return sortArray(objInp);

        function sortArray(data){
            let dataObj = {};
            $.each(data[0],function(i,field){
                if(field.type == 'checkbox'){
                    //dataObj[field['id']] = ((field['value'] == 'on') ? 1 : 0);
                    dataObj[field['id']] = ((field['checked'] == true) ? 1 : 0);
                }else{
                    dataObj[field['id']] = field['value'];
                }
            });

            return dataObj;
        }
    },

    setGraph: function( venta, valor, head=false){
        let master = $(this);
        venta = parseFloat(venta);
        valor = parseFloat(valor);
        let percent = (valor/venta) * 100;
        if( isNaN(percent) ){
            percent = 0;
        }
        if(!head){
            master.find("span[graph='label']").html("<b>$"+ currencyFormat(valor) +"</b> <small class='text-info'>/ "+ currencyFormat(percent) + "%</small>" );
        }else{
            master.find("span[graph='label']").html("<b>$"+ currencyFormat(valor) +"</b> <small class='text-info'>/ 100%</small>");
        }
        master.find("div[graph='bar']").css({'width': percent + "%"});
        return master;
    },

    setAutoComplete: function(config) {
        let elem = $(this);
        let list = elem.parent().find("#" + elem.attr('id') + "_list");
        let disabledOptions = null;
        if(config.hasOwnProperty('disabledOptions')){
            disabledOptions = config.disabledOptions;
        }
        if (list) {
            list.css({
                cursor: 'pointer'
            });

            list.click(function() {
                let modal = $("#autocompleteModal");
                let modalBody = $('.modal-body').css({
                    height: '400px',
                    overflow: 'auto'
                });
                let nombre = elem.closest('.form-group').find('label').html();
                let table = modal.find('table');
                let buttonAceptar = modal.find('#buttonAceptar');
                $("#filterMS_input").val('');
                table.find('tbody').children().remove();

                $("#filterMS_input").keyup(function() {
                    if ($(this).val().toString().toLowerCase() == '') {
                        table.find('tbody tr').show();
                        return;
                    }
                    table.find("tbody tr").hide();
                    table.find("tbody tr[search*='" + $(this).val().toString().toLowerCase() + "']").closest("tr").show();
                });

                let data = {
                    target: config.target,
                    text: '',
                    extras: ((config.hasOwnProperty('extras')) ? config.extras : '')
                }
                if (config.hasOwnProperty('valorxtra')) {
                    data['valorxtra'] = config.valorxtra();
                }

                $.ajax({
                    url: $(this).getBaseUrl() + config.api,
                    dataType: "json",
                    method: "POST",
                    data: data,
                    success: function(data) {
                        buttonAceptar.unbind('click');
                        buttonAceptar.click(function() {
                            let selectedRow = table.find('tbody').find("tr[seleccionado*='true']");
                            if (!selectedRow.hasClass('disabled')) {
                                elem.val(data[selectedRow.attr('id')]['value']);
                                config.callback(data[selectedRow.attr('id')]);
                                $("#" + config.targetForm).filler(data[selectedRow.attr('id')]);
                                modal.modal("toggle");
                            }
                        });
                        $.each(data, function(k, v) {
                            let tr = createDomElem('<tr>').attr({
                                id: k,
                                seleccionado: 'false',
                                'search': (v['value']).toString().toLowerCase()
                            });

                            if(disabledOptions != null){
                                if (config.disabledOptions && v[config.disabledOptions.field] == config.disabledOptions.value) {
                                    tr.addClass('disabled').css({
                                        'color': '#ccc',
                                        'cursor': 'not-allowed'
                                    });
                                }
                            }

                            tr.click(function() {
                                if (!$(this).hasClass('disabled')) {
                                    table.find('tbody').find("tr[seleccionado*='true']").each(function() {
                                        $(this).attr('seleccionado', 'false').css('background-color', 'transparent')
                                    });
                                    $(this).attr({
                                        seleccionado: 'true'
                                    }).css({
                                        'background-color': 'rgb(0, 255, 0, 0.2)'
                                    });
                                }
                            });

                            tr.on('dblclick', function() {
                                if (!$(this).hasClass('disabled')) {
                                    buttonAceptar.click();
                                }
                            });

                            let td = createDomElem('<td>');
                            let textTd = v.value;
                            if( disabledOptions != null ){
                                if(v[disabledOptions.field] == disabledOptions.value){
                                    textTd += ' ('+v[disabledOptions.description]+')';
                                }
                            }
                            td.html(textTd);
                            tr.append(td);
                            table.find('tbody').append(tr);
                        });
                    }
                });

                modal.find(".modal-title").html(nombre);
                modal.modal("toggle");
            });
        }

        elem.autocomplete({
            minLength: 3,
            delay: 500,
            source: function(request, response) {
                let data = {
                    target: config.target,
                    text: request.term,
                    extras: ((config.hasOwnProperty('extras')) ? config.extras : '')
                }
                if (config.hasOwnProperty('valorxtra')) {
                    data['valorxtra'] = config.valorxtra();
                }

                $.ajax({
                    url: $(this).getBaseUrl() + config.api,
                    dataType: "json",
                    method: "POST",
                    data: data,
                    success: function(data) {
                        let filteredData = data.map(function(item) {
                            if( disabledOptions != null ){
                                if (config.disabledOptions && item[config.disabledOptions.field] == config.disabledOptions.value) {
                                    item.disabled = true;
                                    item.value = `${item.value} ( ${item[config.disabledOptions.description]} )`
                                }
                            }
                            return item;
                        });
                        response(filteredData);
                    }
                });
            },
            search: function() {
                if (config.hasOwnProperty('clear')) {
                    $("#" + config.clear).val('');
                }
            },
            select: function(event, ui) {
                if (ui.item.disabled) {
                    event.preventDefault();
                    return false;
                }
                if (config.hasOwnProperty('callback')) {
                    config.callback(ui.item);
                }
                if (config.hasOwnProperty('fill')) {
                    if (config.fill) {
                        $("#" + config.targetForm).filler(ui.item);
                    }
                } else {
                    $("#" + config.targetForm).filler(ui.item);
                }
                //$("#"+config.targetForm).onEditFocus();
            },
            open: function(event, ui) {
                $(this).autocomplete('widget').css('z-index', 1100);
                $("#" + config.fieldId).val(0);

                $(".ui-autocomplete li").each(function() {
                    let item = $(this).data("ui-autocomplete-item");
                    if (item && item.disabled) {
                        $(this).css({
                            'color': '#ccc',
                            'cursor': 'not-allowed'
                        }).on('click', function(event) {
                            event.preventDefault();
                            return false;
                        });
                    }
                });
            },
            change: function(event, ui) {
                let val = $("#" + config.fieldId).val();
                if (val == 0) {
                    elem.val('')
                    let ret = {};
                    ret[config.fieldId] = 0;
                    config.callback(ret);
                    $.each(config.clearField, function(k, v) {
                        switch (v[0]['type']) {
                            case 'select-one':
                                v.val(0)
                                break;
                            default:
                                v.val('');
                                break;
                        }
                    });
                }
            }
        });
    },

    setDuallist: function(config){
        let elem = $(this);

        if (config.hasOwnProperty('empty')) {
            if (config.empty) {
                elem.empty();
            }
        } else {
            elem.empty();
        }

        function populate(data) {
            $.each(data, function (i, field) {
                let text = '';
                $.each(config.map.text, function (ind, att) {
                    if(field.hasOwnProperty(att) ){
                        if(field[att] != null){
                            text += field[att];
                        }
                    }else{
                        text += att;
                    }
                })
                let html = '<option value="' + field[config.map.value] + '" data-tokens="' + text + '">' + text + '</option>';
                elem.append(html);
            })

            if (config.hasOwnProperty('idSelected')) {
                elem.val('');
                $.each(config.idSelected, function(k,v){
                    elem.find('option[value="'+v+'"]').attr('selected','selected');
                })
            }
            elem.bootstrapDualListbox({
                infoTextEmpty: 'Lista Vacia',
                infoText: 'Mostrando {0}',
                filterPlaceHolder: 'Filtro'
            });
        }

        if (config.hasOwnProperty('obj')) {
            populate(config.obj);
        }
    },

    populateSelect: function (config) {
        let fullData = {};
        let elem = $(this);
        let disabledOptions = null;
        if (config.hasOwnProperty('empty')) {
            if (config.empty) {
                elem.empty();
            }
        } else {
            elem.empty();
        }
        let data = {};
        if (config.hasOwnProperty('extra')) {
            $.extend(data, config.extra);
        }

        if(config.hasOwnProperty('disabledOptions')){
            disabledOptions = config.disabledOptions;
        }

        function populate(data) {
            if (config.hasOwnProperty('default')) {
                if(config.default == true){
                    let defaultText = 'Seleccione...';
                    let defaultValue = '';
                    if(config.hasOwnProperty('defaultText')){
                        defaultText = config.defaultText;
                    }
                    if(config.hasOwnProperty('defaultValue')){
                        defaultValue = config.defaultValue;
                    }
                    let html = '<option value="'+defaultValue+'" disabled selected>'+defaultText+'</option>';
                    elem.append(html);
                }
            }
            $.each(data, function (i, field) {
                let text = '';
                $.each(config.map.text, function (ind, att) {
                    disabled = '';
                    if(field.hasOwnProperty(att) ){
                        if(field[att] != null){
                            text += field[att];
                        }
                    }else{
                        text += att;
                    }
                    if(disabledOptions != null){
                        if(field[disabledOptions.field] == disabledOptions.value){
                            disabled += 'disabled';
                            if(disabledOptions.hasOwnProperty('description')){
                                text += ' ('+field[disabledOptions.description]+')';
                            }
                        }
                    }
                })
                let html = '<option value="' + field[config.map.value] + '" data-tokens="' + text + '" '+disabled+'>' + text + '</option>';
                elem.append(html);
                fullData[field[config.map.value]] = field;

            })
            if (config.hasOwnProperty('wildcard')) {
                let html = '<option value="' + config.wildcard.value + '" data-tokens="' + config.wildcard.text + '">' + config.wildcard.text + '</option>';
                elem.append(html);
            }
            if (config.hasOwnProperty('search')) {
                if (config.search == false) {

                } else {
                    if (!elem.hasClass("select2")) {
                        elem.addClass(['select2', 'select2-hidden-accessible']);
                        $(elem).select2({
                            closeOnSelect: false,
                            dropdownParent: $('body'),
                            width: '100%'
                        });
                    }
                }
            } else {
            }
            if (config.hasOwnProperty('idSelected')) {
                elem.val(config.idSelected);
                if (elem.hasClass("select2")) {
                    elem.trigger('change');
                }
            }
            elem.select();
        }

        if (config.hasOwnProperty('obj')) {
            populate(config.obj);
        } else {
            $.ajax({
                method: "POST",
                url: $(this).getBaseUrl() + config.api,
                data: data
            })
                .done(function (data, textStatus, jqXHR) {
                    populate(data);
                    if (config.hasOwnProperty('afterAjaxCall')) {
                        config.afterAjaxCall(data);
                    }
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    //alert((JSON.parse(jqXHR.responseText)).message);
                })
        }
        if (config.hasOwnProperty('callback') || config.hasOwnProperty('chTarget') ) {
            elem.unbind('change');
            elem.change(function () {
                if (config.hasOwnProperty('chTarget')) {
                    $.each(config.chTarget, function (k, i) {
                        let extra = ((i.hasOwnProperty('extra')) ? i.extra : '' );
                        let met = {
                            api: i['api'],
                            map: {
                                value: 'clave',
                                text: [
                                    "descripcion"
                                ]
                            },
                            empty: true,
                            search: false,
                            idSelected: 0,
                            extra: {
                                val: elem.val(),
                                extra: extra
                            }
                        };
                        if(i.hasOwnProperty('afterAjaxCall')){
                            met['afterAjaxCall'] = i.afterAjaxCall;
                        }
                        i['elem'].populateSelect(met);
                    });
                }
                if (config.hasOwnProperty('clearField')) {
                    $.each(config.clearField, function (k, v) {
                        switch (v[0]['type']) {
                            case 'select-one':
                                v.children().remove()
                                break;
                            default:
                                v.val('');
                                break;
                        }
                    });
                }
                if (config.hasOwnProperty('callback')) {
                    config.callback(elem.val(), fullData[elem.val()]);
                }
            })
        }
    },

    filler: function( data, suffix = '' ) {
        let self = this
        $.each( data, function( property, value ){
            if(self.find("#"+property+suffix).length){
                if(self.find("#"+property+suffix)[0].type == "checkbox"){
                    if(value == true){
                        self.find("#"+property+suffix).attr("checked",true);
                    }else{
                        self.find("#"+property+suffix).attr("checked",false);
                    }
                }else{
                    if(self.find("#"+property+suffix)[0].type == 'datetime-local'){
                        if(value != null){
                            value = value.replace(' ', 'T')
                        }
                    }
                    if(self.find("#"+property+suffix)[0].type == "file"){

                    }else{
                        self.find("#"+property+suffix).val(value);

                        if(self.find("#"+property+suffix).hasClass("select2")){
                            self.find("#"+property+suffix).val(value).trigger('change');
                        }
                    }

                }
            }
        });
    },

    fieldBlurControl: function(){
        let self = this;
        this.find("input").blur(function(){
            let data = {};
            data[this.id] = this.value;
            self.tplFiller(data);
        });
        this.find('select').change(function(){
            let data = {};
            data[this.id] = this.value;
            self.tplFiller(data);
        });

        this.find('select').select(function(){
            let data = {};
            data[this.id] = this.value;
            self.tplFiller(data);
        });


    },

    tplFiller: function( data ) {
        let self = this;
        $.each( data, function( property, value )
        {
            if(self.find("#"+property+"_tpl").length){
                if(property.hasOwnProperty('type') && self.find("#"+property)[0].type == "checkbox"){
                    /*if(value == true){
                        self.find("#"+property).attr("checked",true);
                    }else{
                        self.find("#"+property).attr("checked",false);
                    }*/
                }else{
                    if(property.hasOwnProperty('type') && self.find("#"+property)[0].type == "select-one"){
                        self.find("#"+property+"_tpl").html(self.find("#"+property+" option:selected").text());
                    }else{
                        self.find("#"+property+"_tpl").html(value);
                    }
                }
            }
        });
    },

    createCheckList(config){
        let api = config.api;
        let map = config.map;
        let tableKey = config.key;
        let conteo = (config.hasOwnProperty('conteo')) ? config.conteo : false;
        let modalSize = (config.hasOwnProperty('modalSize')) ? config.modalSize : 'lg';
        let modalTitle = (config.hasOwnProperty('modalTitle')) ? config.modalTitle : 'Seleccione';
        let xlsfield = false;
        let xlsFieldSelector = false;
        if(config.hasOwnProperty('xlsfield')){
            xlsfield = config.xlsfield;
        }
        if(config.hasOwnProperty('xlsFieldSelector')){
            xlsFieldSelector = config.xlsFieldSelector;
        }
        let dat = {};
        let max = ((config.hasOwnProperty('max')) ? config.max : 0)
        let busqueda = ((config.hasOwnProperty('busqueda')) ? config.busqueda : false);
        let count = 0;
        if(config.hasOwnProperty('extraParams')){
            dat = config.extraParams;
        }
        let dataObj ={};

        let modal = $('<div>').attr({
            class: "modal fade",
            id: "modal-del"
        });

        let modalHtml = '<div class="modal-dialog modal-'+modalSize+'">';
        modalHtml += '<div class="modal-content">';
        modalHtml += '<div class="modal-header">';
        modalHtml += '<h5 class="modal-title">'+modalTitle+'</h5>';
        //modalHtml += '<button type="button" class="close" data-dismiss="modal" aria-label="Close">';
        //modalHtml += '<span aria-hidden="true">&times;</span>';
        //modalHtml += '</button>';
        modalHtml += '</div>';
        modalHtml += '<div class="modal-body" style="height: 500px; overflow: auto;">';
        modalHtml += '<div className="row form-group col-md-12" id="filterMS">';
        modalHtml += '<label for="filterMS_input" className="col-sm-2 col-form-label col-form-label-sm label-input"><i class="fas fa-search"></i>Filtro</label>';
        modalHtml += '<div className="col-sm-2 p-0 mb-2"> <input type="text" className="form-control form-control-sm" id="filterMS_input"> <i style="color:red;" id="cleanFilterMSInput" title="Borrar busqueda" class="fas fa-times-circle"></i>';
        if(conteo != false){
            modalHtml +='<span id="conteo" style="float: right;">Total: $0.00</span>';
        }
        modalHtml +='</div>';
        if(xlsfield != false){
            modalHtml += '<label htmlFor="'+xlsfield.name+'">Archivo XLS:</label>';
            modalHtml += '<input type="file" className="form-control form-control-xs" id="'+xlsfield.name+'">';
        }
        if(xlsFieldSelector != false){
            let templateXls = `<div class="col-md-12">
                                <label for="tipo_carga">
                                    Tipo de carga
                                </label>
                                <select class="form-control form-control-xs" id="tipo_carga">
                                    <option value="folio"> Folio </option>
                                    <option value="timbrefiscaldigitalUUID"> UUID </option>
                                </select>
                                <label for="xls_file">Archivo XLS:</label>
                                <input type="file" class="form-control form-control-xs" id="xls_file">
                                </div>`;
            modalHtml += templateXls;
        }
        modalHtml += '</div>';
        modalHtml += '<div class="col-md-12" id="checklistTable"></div>';
        modalHtml += '</div>';
        modalHtml += '<div class="modal-footer justify-content-between">';
        modalHtml += '<button type="button" id="btnCerrar" class="btn btn-sm btn-default" data-dismiss="modal">Cancelar</button>';
        modalHtml += '<button type="button" id="btnAceptar" class="btn btn-sm btn-success" data-dismiss="modal">Aceptar</button>';
        modalHtml += '</div>';
        modalHtml += '</div>';
        modalHtml += '</div>';

        modal.append(modalHtml);
        $('body').append(modal);
        modal.modal({
            backdrop: false
        })
        modal.modal("show");

        modal.find("#filterMS_input").keyup(function(){
            if($(this).val().toString().toLowerCase() == ''){
                $("#checklistTable tr").show();
                return;
            }
            $("#checklistTable tbody tr").hide();
            $("#checklistTable tbody tr td[search*='"+$(this).val().toString().toLowerCase()+"']").closest("tr").show();
        });

        modal.find('#cleanFilterMSInput').click(function(){
            modal.find('#filterMS_input').val('').keyup();
        });

        $("#btnAceptar").click(function(){
            let obj = [];
            let returnIds = [];
            let returnObj = {};
            let tableRowsCheck = $("#checklistTable").find('tbody').find('tr').find('input[type="checkbox"]:checked');
            $.each(tableRowsCheck, function(){
                returnIds.push(parseInt($(this).closest('tr').attr(tableKey)));
            })
            $.each(dataObj, function(k,v){
                if($.inArray(v[tableKey], returnIds) !== -1){
                    obj.push(v);
                };
            });
            returnObj['ids'] = returnIds;
            returnObj['obj'] = obj;
            if(config.hasOwnProperty('callback')){
                config.callback(returnObj);
            }
            modal.on('hidden.bs.modal', function (e) {
                modal.remove();
            });
        });

        $("#btnCerrar").click(function(){
            modal.on('hidden.bs.modal', function (e) {
                modal.remove();
            });
            if(config.hasOwnProperty('callbackCancel')){
                config.callbackCancel();
            }
        });

        function createTable(obj){
            let formatArr = {};
            let retorno = {};
            let table = $('<table>').addClass('table table-sm table-striped');
            let thead = $('<thead>');
            let tr = $('<tr>');
            let th = $('<th>');
            tr.append(th);

            $.each(obj, function(i,v){
                let th = $('<th>').attr({
                    'key': i
                });
                if($.isPlainObject(v)){
                    formatArr[i] = {
                        decimal: v.decimal
                    }
                    th.attr({
                        'format': v.moneda,
                        'decimal': v.decimal
                    }).html(v.label);
                }else{
                    th.html(v);
                }
                tr.append(th);
            });
            thead.append(tr);
            table.append(thead);

            retorno['table'] = table;
            retorno['format'] = formatArr;

            return retorno;
        }

        function dataService(params){
            $.ajax({
                method: "POST",
                url: $(this).getBaseUrl()+api,
                data: dat
            })
                .done(function( data, textStatus, jqXHR  ) {
                    let tableArr = createTable(map);
                    let formatArr = tableArr.format;
                    let table = tableArr.table;
                    let tbody = $('<tbody>');
                    let total = 0;
                    $.each(data.data, function(i,v){
                        let row = $('<tr>').attr(tableKey, v[tableKey]);
                        row.attr('field', tableKey);
                        row.attr('pos', i);
                        let tdCheck = $('<td>');
                        let check = $('<input>').attr({
                            type: 'checkbox',
                            value: tableKey
                        }).addClass("form-check-input");
                        check.click(function(){
                            if($(this).is(':checked')){
                                count++;
                                if(v.hasOwnProperty('total')){
                                    total+=parseFloat(v.total);
                                    $('#conteo').text('Total: $'+currencyFormat(total));
                                }
                            }else{
                                count--;
                                if(v.hasOwnProperty('total')){
                                    total-=parseFloat(v.total);
                                    $('#conteo').text('Total: $'+currencyFormat(total));
                                }
                            }
                            if(max != 0){
                                if(count == max){
                                    table.find('input[type=checkbox]:not(:checked)').attr('disabled','disabled')
                                }else{
                                    table.find('input[type=checkbox]:not(:checked)').removeAttr('disabled')
                                }
                            }

                            if($(this).is(':checked')){
                                if(busqueda != false){
                                    $('#filterMS_input').val(v[busqueda]);
                                    $('#filterMS_input').keyup();
                                    //$('#filterMS_input').attr('disabled','disabled')
                                }
                            } else {
                                if(count<1){
                                    $('input:checkbox').prop('checked');
                                    $('#filterMS_input').val('');
                                    $('#filterMS_input').keyup();
                                    //$('#filterMS_input').removeAttr('disabled');
                                }
                            }
                        });
                        tdCheck.append(check);
                        row.append(tdCheck);
                        $.each(map, function(k,h){
                            let cel = $('<td>');
                            if((v[k]) != null){
                                cel.attr({
                                    'search': (v[k]).toString().toLowerCase()
                                });
                            }
                            if(formatArr.hasOwnProperty(k)){
                                cel.css({
                                    'text-align': 'right'
                                });
                                cel.html('$ '+currencyFormat(v[k]));
                            }else{
                                cel.html(v[k]);
                            }
                            row.append(cel);
                        });
                        tbody.append(row);
                    });
                    table.append(tbody);
                    $("#checklistTable").append(table);

                    if(params.hasOwnProperty('callback')){
                        params.callback(data.data);
                    }

                    $("#"+xlsfield.name).change(function(){
                        xlsfield.callback(data.data,xlsfield);
                    })
                    $("#"+xlsFieldSelector.name).change(function(){
                        xlsFieldSelector.callback(data.data,xlsfield);
                    })
                })
                .fail(function( jqXHR, textStatus, errorThrown ){
                    toastr.error("Ocurrio un error al obtener los datos");
                    //alert((JSON.parse(jqXHR.responseText)).message);
                })
        }

        dataService({
            callback: function(obj){
                dataObj = obj;
            }
        });
    },

    rowSuma(params){
        let obj = params.obj;
        let field = params.field;
        let custom = ((params.hasOwnProperty('custom'))? params.custom : {});
        let sum;
        let count = 0;
        if($.isArray(field)){
            sum = {};
            $.each(obj, function (i,v){
                count++;
                $.each(field, function (k,f){
                    if(!sum.hasOwnProperty(f)){
                        sum[f] = 0;
                    }
                    if(custom.hasOwnProperty(f)) {
                        if (custom[f].hasOwnProperty('field')) {
                            if (v[custom[f]['field']] == custom[f]['value']) {
                                sum[f] += 1;
                            }
                        } else {
                            sum[f] += parseFloat(((v[f] == null || v[f] == '') ? 0 : v[f]));
                        }
                    }
                });
            })
        }else{
            sum = 0;
            $.each(obj, function (i,v){
                count++;
                sum += parseFloat(((v[field] == null || v[field] == '') ? 0 : v[field]));
            })
        }
        sum['items'] = count;
        return sum;
    },

    fillInfoBoxes(params) {
        let obj = params.obj;
        let sumFields = [];
        let dep = [];
        let elem = $(this);
        let total = 0;
        $.each(params.fields,function(k,v){
            sumFields.push(k);
        });
        let sumas = $(this).rowSuma({
            obj: obj,
            field: sumFields,
            custom: params.fields
        })
        $.each(params.fields,function(i,t){
            elem.find("#"+i+"_total").find(".info-box-text").html(t.nombre);
            if(t.hasOwnProperty('formato')){
                switch (t.formato) {
                    case 'entero':
                        elem.find("#"+i+"_total").find(".info-box-number").html(currencyFormat(sumas[i],0));
                        break;
                    case 'moneda':
                        total += sumas[i];
                        elem.find("#"+i+"_total").find(".info-box-number").html('$ '+currencyFormat(sumas[i]));
                        break;
                    case 'numerico':
                        total += sumas[i];
                        elem.find("#"+i+"_total").find(".info-box-number").html(currencyFormat(sumas[i]));
                        break;
                    case 'promedio':
                        total += sumas[i];
                        elem.find("#"+i+"_total").find(".info-box-number").html(currencyFormat((sumas[i] / sumas['items'])));
                        break;
                    case 'items':
                        elem.find("#"+i+"_total").find(".info-box-number").html((sumas['items']));
                        break;
                }
            }else{
                total += sumas[i];
                elem.find("#"+i+"_total").find(".info-box-number").html('$ '+currencyFormat(sumas[i]));
            }
        });

        if(params.hasOwnProperty('total')){
            elem.find("#"+params.total.field).find(".info-box-text").html(params.total.nombre);
            switch (params.total.formato) {
                case 'entero':
                    elem.find("#"+params.total.field).find(".info-box-number").html(currencyFormat(((sumas.hasOwnProperty('total')) ? sumas.total : total ),0));
                    break;
                case 'moneda':
                    elem.find("#"+params.total.field).find(".info-box-number").html(currencyFormat(((sumas.hasOwnProperty('total')) ? sumas.total : total) ));
                    break;
            }

        }
    },

    createPaymentTable(params){
        let table = $(this);
        let api = params.api;
        let dat = params.apiData;
        let tableKey = params.tableKey;
        let map = [];
        let formatMap = [];


        table.find('tbody').children().remove();
        params.montoSaldarField.val(params.monto);

        $.each(table.find('thead').find('tr').find('th'),function(k,th){
            if(th.attributes.hasOwnProperty('key')){
                map.push(th.attributes['key'].value);
            }
            if(th.attributes.hasOwnProperty('format')){
                formatMap.push(th.attributes['format'].value);
            }else{
                formatMap.push('');
            }
        });

        function dataService(params){
            $.ajax({
                method: "POST",
                url: $(this).getBaseUrl()+api,
                data: dat
            })
                .done(function( data, textStatus, jqXHR  ) {
                    $.each(data.data, function(i,v){
                        let row = $('<tr>').attr(tableKey, v[tableKey]);
                        row.attr('field', tableKey);
                        let tdCheck = $('<td>');
                        let check = $('<input>').attr({
                            type: 'checkbox',
                            onClick: function() {
                                //llenar();
                            },
                            value: tableKey
                        })/*.addClass("form-check-input")*/;
                        tdCheck.append(check);
                        row.append(tdCheck);
                        $.each(map, function(k,h){
                            let cel = $('<td>');
                            let fieldText;
                            let tdAlign = "center";
                            let padding = "0";
                            switch(formatMap[k+1]) {
                                case 'moneda':
                                    fieldText = currencyFormat(v[h]);
                                    tdAlign = "right";
                                    break;
                                case 'input':
                                    let input = $('<input>').attr({
                                        type: 'number',
                                        step: 'any',
                                        id: 'monto_'+v[tableKey]
                                    }).addClass('form-control form-control-sm');padding = "10px";
                                    cel.append(input);
                                    break;
                                case 'date' :
                                    let date_input = $('<input>').attr({
                                        type: 'date',
                                        id: 'fecha_'+v[tableKey]
                                    }).addClass('form-control form-control-sm');padding = "10px";
                                    if( v[h] != null ){
                                        date_input.attr("value",v[h]);
                                    }
                                    cel.append(date_input);
                                    break;
                                default:
                                    fieldText = v[h];
                                    break;
                            }
                            cel.append(fieldText).css({
                                'text-align': tdAlign,
                                'padding-left': padding
                            });
                            row.append(cel);
                        });
                        table.find('tbody').append(row);
                    });
                    /*$("#checklistTable").append(table);

                    if(params.hasOwnProperty('callback')){
                        params.callback(data.data);
                    }*/
                })
                .fail(function( jqXHR, textStatus, errorThrown ){
                    toastr.error("Ocurrio un error al obtener los datos");
                    //alert((JSON.parse(jqXHR.responseText)).message);
                })
        }

        dataService({
            callback: function(obj){
                dataObj = obj;
            }
        });
    }
});



function tableControl(config){
    this.config = config;
    this.table = config.table;
    this.form = config.form;
    this.key = config.key;
    this.addButton = config.addButton;
    this.key_conceptos = config.key_conceptos;
    this.tableObj = config.tableObj;
    this.buttonsDefault = true;
    this.columns = config.columns;
    this.edicion = false;
    this.tfoot = false;
    this.dnd = false;
    this.buttonEdit = true;
    this.newCount = 0;
    this.summary_array;
    this.files_array = {};
    this.fileOptions = [1,1,1,1];
    this.fileModel = false;
    this.customButtons = false;
    this.addOneRow = false;
    this.onEdit = function(){
        return;
    }
    this.callback = function(){
        return;
    }
    this.addCallback = function(){
        return;
    }
    this.dndOnDropCallBack = function(){
        return;
    }
    this.chkCallBack = function(){
        return;
    }
    if(config.hasOwnProperty('onEdit')){
        this.onEdit = config.onEdit;
    }
    if(config.hasOwnProperty('callback')){
        this.callback = config.callback;
    }
    if(config.hasOwnProperty('addCallback')){
        this.addCallback = config.addCallback;
    }
    if(config.hasOwnProperty('dndOnDropCallBack')){
        this.dndOnDropCallBack = config.dndOnDropCallBack;
    }
    if(config.hasOwnProperty('chkCallBack')){
        this.chkCallBack = config.chkCallBack;
    }
    if(config.hasOwnProperty('tfoot')){
        this.tfoot = config.tfoot;
    }
    if(config.hasOwnProperty('buttonsDefault')){
        this.buttonsDefault = config.buttonsDefault;
    }
    if(config.hasOwnProperty('dnd')){
        this.dnd = config.dnd;
    }
    if(config.hasOwnProperty('buttonEdit')){
        this.buttonEdit = config.buttonEdit;
    }
    if(config.hasOwnProperty('fileOptions')){
        this.fileOptions = config.fileOptions;
    }
    if(config.hasOwnProperty('fileModel')){
        this.fileModel = config.fileModel;
    }

    if(config.hasOwnProperty('customButtons')){
        this.customButtons = config.customButtons;
    }
    if( config.hasOwnProperty('addOneRow') ){
        this.addOneRow = config.addOneRow;
    }
    this.addRowConceptos(this.tableObj);
    this.bindClick();
}

tableControl.prototype.bindClick = function(){
    let self = this;

    self.addButton.click(function(){
        let add = true;
        if( self.hasOwnProperty('addOneRow') ){
            if( self.tableObj.length > 0  && self.addOneRow){
                add = false;
            }
        }
        let error = false;
        let obj = [];
        let rowData = {};
        rowData[self.key] = 0;
        let errorMessage = "";
        let focusId = "";

        $.each(self.columns, function (i,v){
            if(v.field && !error){
                let field = v.field;
                let key = v.key;
                let requerido = field.attr('req');
                let cantField = field.attr('cant');
                let value = field.val();
                errorMessage = field.attr('errmsg');
                focusIdChanged = field.attr('focusIdChanged');
                focusId = field.attr('id');

                if(field[0].nodeName == "SELECT"){
                    if(field[0].nodeName == "SELECT" && requerido == '1' && (value == '0' || value == '' || value == null)){
                        error = true;
                    }
                }else{
                    if(requerido == '1' && value == '')  {
                        error = true;
                    }
                    if( cantField == '1' && value <= 0 ){
                        error = true;
                    }
                }

                rowData[key] = value;
                if(field[0].type == "checkbox"){
                    rowData[key] = field.prop('checked');
                }
                if(field[0].type == "file"){
                    rowData[key] = field[0].files[0];
                }
            }
        });
        if(!error){
            if ( add ){
                obj.push(rowData);
                self.tableObj.push(rowData);
                self.addCallback(rowData);
                self.addRowConceptos(obj,true);
            }
        }else{
            if(typeof errorMessage === 'undefined' || errorMessage == "")
            {
                errorMessage = "Faltan Datos.";
            }

            if(typeof focusIdChanged === 'undefined' || focusIdChanged == "")
            {
                focusId = focusId;
            }
            else
            {
                focusId = focusIdChanged;
            }

            $(document).Toasts('create', {
                title: 'Error',
                class: 'bg-warning',
                autohide: true,
                delay: 2000,
                body: errorMessage,
                position: 'bottomRight'
            });

            $('#' + focusId).focus();
        }
    })
}

tableControl.prototype.summary = function(){
    let self = this;
    self.summary_array = {};

    $.each(self.tableObj,function(i,v){
        if(!v.borrado_logico){
            $.each(self.columns,function(k,o){
                if(o.summary){
                    if(self.summary_array.hasOwnProperty(o.key)){
                        self.summary_array[o.key] += ((v[o.key] == null) ? 0 : parseFloat(v[o.key]) )
                    }else{
                        self.summary_array[o.key] = 0
                        self.summary_array[o.key] += ((v[o.key] == null) ? 0 : parseFloat(v[o.key]) )
                    }

                }
            })
        }
    });
    self.footer(self.summary_array);
    return self.summary_array;
}

tableControl.prototype.footer = function(montos){
    let self = this;
    let tfoot = self.table.find('tfoot');
    if(tfoot && !self.tfoot){
        tfoot.find('tr').remove();
        let tr = $("<tr>");
        tr.css('font-size','14px');
        $.each(self.columns,function(k,o) {
            let td = $("<th>").css('text-align','right');
            if (o.summary) {
                td.html(currencyFormat(montos[o.key]));
            }
            if(!o.hidden){
                tr.append(td)
            }
        });
        tfoot.append(tr);
    }
}

tableControl.prototype.editRow = function(elem){
    let self = this;
    if(!self.edicion){
        let tr = $(elem).closest("tr");
        let id = tr.attr("newId");
        let newObj = {};

        function findObjNew(obj) {
            return obj['new'] == id;
        }

        let obj = self.tableObj.find(findObjNew);

        tr.css({
            'background-color': 'yellow'
        });

        $.each(self.columns, function (i,v){
            newObj[v['field'][0]['id']] = obj[v.key];
        });

        //<i class="fa-solid fa-circle-check"></i>
        self.onEdit(newObj);
        self.form.filler(newObj);
        self.edicion = true;
        self.addButton.hide();
        let divButtons = createDomElem('<div>','',{
            id: 'divButtons'
        });
        let aceptar = createDomElem('<i>','fa fa-check-circle');
        aceptar.css({
            color: 'rgb(40, 167, 69)',
            cursor: 'pointer'
        });
        aceptar.click(function(){
            let error = false;
            let rowData = {};
            $.each(self.columns, function (i,v){
                if(v.field && !error){
                    let field = v.field;
                    let key = v.key;
                    let requerido = field.attr('req');
                    let value = field.val();
                    if(requerido == '1' && value == '')  {
                        error = true;
                    }
                    if(field.nodeName == "SELECT" && requerido == '1' && (value == '0' || value == '' || value == null)){
                        error = true;
                    }
                    if(field[0].type == "checkbox"){
                        obj[key] = field.prop('checked');
                    }
                    if(field[0].type == "file"){
                        if(obj[key] == null){
                            value = null
                        }else{
                            value = obj[key];
                        }
                    }
                    obj[key] = value;
                }
            });

            let row = self.buildRow(0, obj,false);
            tr.replaceWith(row);
            divButtons.remove();
            self.edicion = false;
            self.addButton.show();
            self.summary();
            self.callback(self.tableObj, self.summary_array, false, true,obj);
        })
        let declinar = createDomElem('<i>','fa fa-times-circle');
        declinar.css({
            color: 'rgb(211, 55, 36)',
            cursor: 'pointer'
        });
        declinar.click(function(){
            self.edicion = false;
            self.addButton.show();
            tr[0].style.removeProperty('background-color');
            self.form.find('#divButtons').remove();
        });
        divButtons.append(aceptar,' ',declinar);
        self.form.find('td:last-child').addClass('align-middle').append(divButtons);
        self.callback(self.tableObj, self.summary_array);
        //self.form.find("td:last-child div[role='group']").show();
    }else{
        toastr.error('Concepto en Edicion.');
    }
}

tableControl.prototype.buildRow = function(r, objRow, own){
    let self = this;

    editRowConceptos = function(elem){
        let tr_id = $(elem).closest("tr").attr("id");
        let id = parseInt((tr_id.split('_'))[1]);
        let dataRows = elem.closest('tr');
        let obj = [];
        let rowObj = {};
        if(!self.edicion){
            $.each(dataRows,function (){
                let tr = $(this);
                tr.css({
                    'background-color': 'yellow'
                });
                tr.find(':last-child');
                rowObj[tr.attr('field')] = tr.attr('val');
                $.each(self.columns,function(i, v){
                    rowObj[v.field[0]['id']] = self.tableObj[id][v.key];
                    //rowObj[v.key] = tr.find("td[field='"+v.key+"']").attr('val');
                    //rowObj[v.key+'_text'] = tr.find("td[field='"+v.key+"']").html();
                });
                obj.push(rowObj);
            });
            //<i class="fa-solid fa-circle-check"></i>
            self.form.filler(rowObj);
            //self.edicion = true;
            self.addButton.hide();
            let aceptar = createDomElem('<i>','fa-solid fa-circle-check');
            aceptar.css({
                color: 'rgb(53, 124, 165)',
                cursor: 'pointer'
            });
            self.callback(self.tableObj, self.summary_array);
            //self.form.find("td:last-child div[role='group']").show();
        }else{
            toastr.error('Concepto en Edicion.');
        }

        /*if(params.config.hasOwnProperty('editCallback')){
            params.config.editCallback();
        }*/
    }

    // deleteRowConceptos = function(elem,rl_obj){
    //     if(!rl_obj.edicion){
    //         let modal = $('<div>').attr({
    //             class: "modal fade",
    //             id: "modal-del"
    //         });

    //         let modalHtml = '<div class="modal-dialog">';
    //         modalHtml += '<div class="modal-content">';
    //         modalHtml += '<div class="modal-header">';
    //         modalHtml += '<h4 class="modal-title">Eliminar Registro</h4>';
    //         modalHtml += '<button type="button" class="close" data-dismiss="modal" aria-label="Close">';
    //         modalHtml += '<span aria-hidden="true">&times;</span>';
    //         modalHtml += '</button>';
    //         modalHtml += '</div>';
    //         modalHtml += '<div class="modal-body">';
    //         modalHtml += '<p>Desea Eliminar el Registro ?</p>';
    //         modalHtml += '</div>';
    //         modalHtml += '<div class="modal-footer justify-content-between">';
    //         modalHtml += '<button type="button" id="btnCerrar" class="btn btn-default" data-dismiss="modal">Cancelar</button>';
    //         modalHtml += '<button type="button" id="btnEliminar" class="btn btn-danger" data-dismiss="modal">Eliminar</button>';
    //         modalHtml += '</div>';
    //         modalHtml += '</div>';
    //         modalHtml += '</div>';

    //         modal.append(modalHtml);
    //         $('body').append(modal);
    //         modal.modal("show");

    //         $("#btnEliminar").click(function(){
    //             let objId = elem.closest('tr')[0].attributes.val.value;
    //             if(objId > 0 ){
    //                 function borrado_logico(conceptos) {
    //                     return conceptos[rl_obj.key] == objId;
    //                 }

    //                 let obj = rl_obj.tableObj.find(borrado_logico);
    //                 obj.borrado_logico = true;
    //             }else{
    //                 let indice = elem.closest('tr')[0].attributes.newid.value;

    //                 function borrado(conceptos) {
    //                     return conceptos.new == indice;
    //                 }
    //                 let key = rl_obj.tableObj.findIndex(borrado);
    //                 rl_obj.tableObj.splice(key,1);
    //                 $.each(self.files_array,function(k,v){
    //                     delete v[indice];
    //                 })
    //             }
    //             elem.closest('tr').remove();
    //             rl_obj.callback(rl_obj.tableObj, rl_obj.summary(),true);
    //             /*if(config.hasOwnProperty('delCallback')){
    //                 config.delCallback(elem,config);
    //             }*/
    //             modal.on('hidden.bs.modal', function (e) {
    //                 modal.remove();
    //             });
    //         });

    //         $("#btnCerrar").click(function(){
    //             modal.on('hidden.bs.modal', function (e) {
    //                 modal.remove();
    //             });
    //         });
    //     }else{
    //         toastr.error('Concepto en Edicion.');
    //     }
    // }
    deleteRowConceptos = function(elem, rl_obj){
    if(!rl_obj.edicion){
        let modal = $('<div>').attr({
            class: "modal fade",
            id: "modal-del"
        });

        let modalHtml = '<div class="modal-dialog">';
        modalHtml += '<div class="modal-content">';
        modalHtml += '<div class="modal-header">';
        modalHtml += '<h4 class="modal-title">Eliminar Registro</h4>';
        modalHtml += '<button type="button" class="close" data-dismiss="modal" aria-label="Close">';
        modalHtml += '<span aria-hidden="true">&times;</span>';
        modalHtml += '</button>';
        modalHtml += '</div>';
        modalHtml += '<div class="modal-body">';
        modalHtml += '<p>Desea Eliminar el Registro ?</p>';
        modalHtml += '</div>';
        modalHtml += '<div class="modal-footer justify-content-between">';
        modalHtml += '<button type="button" id="btnCerrar" class="btn btn-default">Cancelar</button>';
        modalHtml += '<button type="button" id="btnEliminar" class="btn btn-danger">Eliminar</button>';
        modalHtml += '</div>';
        modalHtml += '</div>';
        modalHtml += '</div>';

        modal.append(modalHtml);
        $('body').append(modal);

        // Antes de mostrar el modal, engancha el evento para eliminarlo del DOM
        modal.on('hidden.bs.modal', function () {
            modal.remove();
        });

        modal.modal("show");

        $("#btnEliminar").click(function(){
            let objId = elem.closest('tr')[0].attributes.val?.value;
            if(objId > 0 ){
                let obj = rl_obj.tableObj.find(c => c[rl_obj.key] == objId);
                obj.borrado_logico = true;
            } else {
                let indice = elem.closest('tr')[0].attributes.newid?.value;
                let key = rl_obj.tableObj.findIndex(c => c.new == indice);
                rl_obj.tableObj.splice(key,1);
                $.each(self.files_array,function(k,v){
                    delete v[indice];
                });
            }
            elem.closest('tr').remove();
            rl_obj.callback(rl_obj.tableObj, rl_obj.summary(), true);

            // Cierra el modal
            modal.modal('hide');
        });

        $("#btnCerrar").click(function(){
            modal.modal('hide');
        });
    } else {
        toastr.error('Concepto en Edicion.');
    }
}


    let edit = $('<i>').addClass("icofont icofont-ui-edit").css({
        color: "#357ca5",
        cursor: "pointer"
    }).click(function (){
        self.editRow($(this));
    });
    let del = $('<i>').addClass("icofont icofont-ui-delete").css({
        color: "#d33724",
        cursor: "pointer"
    }).click(function (){
        deleteRowConceptos($(this),self);
    });
    //obj[r][self.key] = ((objRow.hasOwnProperty(self.key)) ? objRow[self.key] : 0 );
    objRow[self.key] = ((objRow.hasOwnProperty(self.key)) ? objRow[self.key] : 0 );
    let rowId = ((objRow.hasOwnProperty(self.key)) ? objRow[self.key] : 0 )
    let rowNumber = ((own) ? (self.tableObj.length - 1) : r );
    self.newCount++;
    objRow['new'] = (objRow.hasOwnProperty('new')) ? objRow['new'] : self.newCount ;
    let tr = $('<tr>').attr({
        val: rowId,
        field: self.key,
        id:'row_'+rowNumber,
        newId: ((objRow.hasOwnProperty('new')) ? objRow.new : null),
    });
    $.each(self.columns,function(i,v){
        if(v.field){
            let field = v.field;
            let key = v.key;
            let td;
            let format = field.attr('format');
            let fieldVal = objRow[key];
            let fieldText = objRow[key];
            let appendPush = false;
            let input;
            if(v.summary){
                if(self.summary.hasOwnProperty(key)){
                    self.summary[key] += parseFloat(fieldVal);
                }else{
                    self.summary[key] = 0;
                    self.summary[key] += parseFloat(fieldVal);
                }
            }
            if(field[0].nodeName == "SELECT"){
                if (v.isSelect && v.showSelect) {
                    appendPush = true;
                    input = $('<select>').addClass('form-control form-control-sm select');

                    $.each(v.options, function(index, option) {
                        var optionElement = $('<option>', {
                            value: option.value,
                            text: option.text,
                        });
                        if (option.hasOwnProperty('selected') && option.selected == 1) {
                            if( typeof fieldVal === 'undefined' )
                            fieldVal = option.value;
                        }
                        input.append(optionElement);
                    });
                    input.val(fieldVal);

                    input.change(function() {
                        let elem = $(this);
                        let indice = (elem.closest('tr')[0].rowIndex - 2);
                        self.tableObj[indice][key] = elem.val();
                        self.summary();
                        if (v.hasOwnProperty('onBlur')) {
                            v.onBlur(elem);
                        } else {
                            return;
                        }
                    });
                } else {
                    if(fieldVal == null){
                        fieldVal = '';
                    }
                    fieldText = field.find("option[value='" + fieldVal.toString() + "']").text();
                    if(objRow.hasOwnProperty(key+'_text')){
                        fieldText = objRow[key+'_text'];
                    }
                }

            }
            if(objRow.hasOwnProperty(key+"_txt")){
                fieldText = objRow[key+"_txt"];
            }
            let tdAlign = 'left';
            let padding = '2px 10px 2px 10px'
            td = $('<td>').attr({
                val: fieldVal,
                field: key
            }).addClass('align-middle');
            switch(format) {
                case 'moneda':
                    fieldText = currencyFormat(fieldText);
                    tdAlign = "right";
                    break;
                case 'moneda':
                    fieldText = currencyFormat(fieldText,6);
                    tdAlign = "right";
                    break;
                case 'numero':
                    fieldText = currencyFormat(fieldText,0);
                    tdAlign = "right";
                    break;
                case 'date':
                    fieldText = formatDate(new Date(fieldText),false);
                    tdAlign = 'center';
                    break;
                case 'input':
                    appendPush = true;
                    input = $('<input>').attr({
                        type: field[0].type,
                        step: 'any',
                        id: key
                    }).addClass(
                        'form-control form-control-sm'
                    ).val(
                        objRow[key]
                    );
                    padding = "10px";
                    input.change(function(){
                        let elem = $(this);
                        let indice = (elem.closest('tr')[0].rowIndex - 2);
                        self.tableObj[indice][key] = elem.val();
                        self.summary();
                        if(v.hasOwnProperty('onBlur')){
                            v.onBlur(elem);
                        }else{
                            return;
                        }
                    });
                    break;
                case 'input_readonly':
                    appendPush = true;
                    input = $('<input>').attr({
                        type: field[0].type,
                        step: 'any',
                        id: key
                    }).addClass(
                        'form-control form-control-sm'
                    ).val(
                        objRow[key]
                    ).attr('readonly','readonly');
                    padding = "10px";
                    input.change(function(){
                        let elem = $(this);
                        let indice = (elem.closest('tr')[0].rowIndex - 2);
                        self.tableObj[indice][key] = elem.val();
                        self.summary();
                        if(v.hasOwnProperty('onBlur')){
                            v.onBlur(elem);
                        }else{
                            return;
                        }
                    });
                    break;
                case 'folio':
                    tdAlign = "center";
                default:
                    fieldText = fieldText
                    break;
            }
            td.css({
                'text-align': tdAlign,
                'padding': padding
            });
            if(field[0].type == "checkbox" ){
                appendPush = true;
                fieldVal = (fieldVal == 'on') ? false : fieldVal ;
                input = createDomElem('<input>','form-check-label',{
                    type: 'checkbox',
                    id: key,
                    checked: ((fieldVal) ? fieldVal : field.is(":checked") ),
                    disabled : format == 'edit' ? false : true
                });
                input.click(function(){
                    let elem = $(this);
                    let indice = (elem.closest('tr')[0].rowIndex - 2);
                    self.tableObj[indice][key] = ((elem.is(':checked')) ? true : false);
                    input.parent().attr({
                        val: $(this).is(':checked')
                    })
                    self.chkCallBack();
                })
                td.attr({
                    val: ((fieldVal) ? fieldVal : field.is(":checked") )
                })

            };

            if(field[0].type == "file" ){
                if(!self.files_array.hasOwnProperty(key)){
                    self.files_array[key] = {};
                }
                if(own){
                    objRow[key] = null;
                }

                appendPush = true;
                let defaultColor = "rgb(24, 49, 83)";
                let defaultPointer = "pointer";
                let disabledColor = "darkgray";
                let disabledPointer = "not-allowed";
                let color = defaultColor;
                let pointer = defaultColor;

                async function filePreview(documentData) {
                    let previewModal = $("#previewModal");
                    let divPreview = document.querySelector('#filePreview')
                    let file = self.files_array[key][documentData];

                    //Clear preview
                    divPreview.innerHTML = ''
                    $("#pdfPreview").removeAttr('src').css('display', 'none');

                    previewModal.modal('toggle');

                    if(!self.files_array[key].hasOwnProperty(documentData)){
                        function findObjNew(dataObj) {
                            return dataObj['new'] == documentData;
                        }

                        let rowObj = self.tableObj.find(findObjNew);

                        const data = new FormData();
                        data.append(self.key, rowObj[self.key]);
                        data.append('model', self.fileModel);
                        data.append('field', self.key);
                        data.append('key', key);
                        await fetch('api/getFileFromTableControl', {
                            method: "POST",
                            headers: {
                                Authorization: 'Bearer '+getDatosEmpleado().token.token
                            },
                            body: data,
                        })
                            .then((response) => response.blob())
                            .then((blob) => {
                                file = blob;
                                file['name'] = rowObj[key];
                            });
                    }

                    previewModal.find(".modal-title").html(file.name);

                    //Load image preview
                    let url = URL.createObjectURL(file);
                    if(file.type == 'application/pdf'){
                        $("#pdfPreview").attr('src',url).css('display','');
                    }else{
                        const img = document.createElement("img");
                        img.src = url;
                        img.height = 250;

                        divPreview.appendChild(img)
                    }

                    //Load image preview
                    let a = document.createElement('a');
                    a.setAttribute('download', '');

                    let download = previewModal.find("#buttonDownload");
                    download.attr({
                        'href': url,
                        'download': file.name
                    })
                }

                let file = createDomElem('<input>','form-check-label',{
                    type: 'file',
                    id: key,
                }).css({
                    display: 'none'
                });

                if(fieldVal == null){
                    color = disabledColor;
                    pointer = disabledPointer;
                }

                let uploadFile =  createDomElem('<i>','fas fa-upload fa-xl',{
                    'title': "Cargar Archivo"
                }).css({
                    color: '#28a745',
                    cursor: 'pointer',
                    'margin-right': '5px'
                });

                uploadFile.click(function(){
                    file.click();
                });

                let downloadFile =  createDomElem('<a>','fas fa-download fa-xl').css({
                    color: color,
                    cursor: pointer,
                    'margin-right': '5px'
                });

                let viewFile =  createDomElem('<i>','far fa-eye fa-xl').css({
                    color: color,
                    cursor: pointer,
                    'margin-right': '5px'
                });

                let deleteFile =  createDomElem('<i>','fas fa-ban fa-xl').css({
                    color: color,
                    cursor: pointer
                });

                viewFile.click(function(){
                    filePreview(objRow.new);
                })

                if(fieldVal != null){
                    viewFile.css({
                        color: defaultColor,
                        cursor: defaultPointer
                    }).attr({
                        title: "Ver " + objRow[key]
                    });

                    downloadFile.css({
                        color: defaultColor,
                        cursor: defaultPointer
                    }).attr({
                        title: "Descargar " + objRow[key],
                        'download': objRow[key]
                    });

                    downloadFile.unbind('click');
                    downloadFile.click(function() {
                        async function filePreview() {
                            const data = new FormData();
                            data.append(self.key, objRow[self.key]);
                            data.append('model', self.fileModel);
                            data.append('field', self.key);
                            data.append('key', key);
                            await fetch('api/getFileFromTableControl', {
                                method: "POST",
                                headers: {
                                    Authorization: 'Bearer ' + getDatosEmpleado().token.token
                                },
                                body: data,
                            })
                                .then((response) => response.blob())
                                .then((blob) => {
                                    fileDownload = blob;
                                });
                            let url = URL.createObjectURL(fileDownload);

                            var element = document.createElement('a');
                            element.setAttribute('href', url);
                            element.setAttribute('download', objRow[key]);
                            element.style.display = 'none';
                            element.click();
                        }
                        filePreview();

                    });

                    deleteFile.css({
                        color: "rgb(211, 55, 36)",
                        cursor: defaultPointer
                    }).attr({
                        title: "Borrar " + objRow[key]
                    });
                }

                deleteFile.click(function(){
                    if(self.files_array[key].hasOwnProperty(objRow.new)){
                        delete self.files_array[key][objRow.new];
                    }
                    function findNewOrder(obj) {
                        return obj['new'] == objRow.new;
                    }
                    let obj = self.tableObj.find(findNewOrder);
                    obj[key] = null;
                    obj[key+"_original"] = null;
                    obj["original"] = null;
                    obj["newFileUpload"] = true;

                    viewFile.css({
                        color: disabledColor,
                        cursor: disabledPointer
                    }).removeAttr('title');

                    downloadFile.unbind('click');
                    downloadFile.css({
                        color: disabledColor,
                        cursor: disabledPointer
                    }).removeAttr('title download href');

                    deleteFile.css({
                        color: disabledColor,
                        cursor: disabledPointer
                    }).removeAttr('title');
                })

                file.change(function(){
                    let elem = $(this);
                    let uploadedFile = elem[0].files[0];
                    let url = URL.createObjectURL(uploadedFile);

                    viewFile.css({
                        color: defaultColor,
                        cursor: defaultPointer
                    }).attr({
                        title: "Ver " + uploadedFile.name
                    });

                    downloadFile.unbind('click');
                    downloadFile.css({
                        color: defaultColor,
                        cursor: defaultPointer
                    }).attr({
                        title: "Descargar " + uploadedFile.name,
                        'download': uploadedFile.name,
                        'href': url,
                    });

                    deleteFile.css({
                        color: "rgb(211, 55, 36)",
                        cursor: defaultPointer
                    }).attr({
                        title: "Borrar " + uploadedFile.name
                    });

                    let originalDate = Date.now();
                    uploadedFile['field'] = self.key;
                    uploadedFile['original'] = originalDate;
                    uploadedFile['key'] = key;
                    objRow[key] = uploadedFile.name;
                    objRow["original"] = originalDate;
                    objRow["newFileUpload"] = true;


                    self.files_array[key][objRow.new] = uploadedFile;
                })

                if(own){
                    if(field[0]['files'].hasOwnProperty(0)){
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(field[0].files[0]);
                        file[0].files = dataTransfer.files;
                        file.change();
                    }
                }

                input = [file,uploadFile,downloadFile,viewFile,deleteFile];
            };

            if(v.hasOwnProperty('clickCallBack')){
                td.css({
                    cursor: 'pointer'
                })
                td.unbind('click');
                td.click(function(){
                    let idRowNumber = ((td.closest('tr').attr('id')).split('_'))[1];
                    let obj = v.clickCallBack(idRowNumber,objRow);
                });
            }

            if(v.hasOwnProperty('changeCallBack')){
                td.css({
                    cursor: 'pointer'
                })
                td.unbind('click');
                td.change(function(){
                    let idRowNumber = ((td.closest('tr').attr('id')).split('_'))[1];
                    let obj = v.changeCallBack(idRowNumber,objRow);
                });
            }

            if(appendPush){
                td.append(input);
            }else{
                td.html(fieldText);
            }

            if(!v.hidden){
                tr.append(td);
            }
        }
    })
    let td = $('<td>');
    td.addClass('align-middle');
    if(self.buttonsDefault){
        if(self.buttonEdit){
            td.append(edit);
            td.append(' ');
        }

        let is_borrado = 1;
        if(objRow.hasOwnProperty('can_delete')) {
            if (objRow.can_delete == 0) {
                is_borrado = 0;
            }
        }
        if(is_borrado == 1){
            td.append(del);
        }

    }

    if(self.customButtons){
        $.each(self.config.customButtons,function(k,v){
            let icon = ((v.hasOwnProperty('icon')) ? v.icon : "fas fa-question" );
            let color = ((v.hasOwnProperty('color')) ? v.color : "#000000" );
            let align = ((v.hasOwnProperty('align')) ? v.align : "left" );
            let button = $('<i>').addClass(icon).css({
                color: color,
                cursor: "pointer"
            }).click(function (){
                let elem = $(this);
                if(v.hasOwnProperty('callback')){
                    v.callback(elem.closest('tr'),objRow);
                }
            });
            td.append(' ');
            td.append(button).css({
                'text-align': align
            });
        });
    }
    if(self.buttonsDefault){
        let editable = 1;
        if(objRow.hasOwnProperty('editable')) {
            if (objRow.editable == 0) {
                editable = 0;
            }
        }
        if(editable == 1){
            tr.append(td);
        }
    }
    tr.append(td);
    return tr;
}

tableControl.prototype.addRowConceptos = function(obj,own = false){
    let self = this;

    $.each(obj, function(r,o){
        let objRow = o;

        if(String(objRow['borrado_logico']) != 'true'){
            let tr = self.buildRow(r, objRow, own);
            self.table.find('tbody').append(tr);

            /*if(params.config.hasOwnProperty('addCallback')){
                params.config.addCallback(self.table,objRow);
            }*/
        }
    })
    if(self.dnd){
        self.setDnd();
    }
    self.setOrder();
    self.callback(self.tableObj, self.summary(),own);
}

tableControl.prototype.sendFiles = function(){
    let self = this;
    let uploadArr = [];
    let deleteArr = [];
    let prepareData = function(fileObj){
        $.each(fileObj,function(field, items){
            $.each(items,function(row,item){
                if(row){
                    function findNewOrder(obj) {
                        return obj['new'] == row;
                    }
                    let obj = self.tableObj.find(findNewOrder);
                    item['order'] = obj['order'];
                    item[self.key] = obj[self.key];
                    uploadArr.push(item);
                }
            })
        });
    }

    prepareData(self.files_array);

    return uploadArr;
}



tableControl.prototype.setDnd = function(){
    let self = this;
    let newObj = {};
    self.table.tableDnD({
        onDrop: function(i,k){
            self.setOrder();
            self.dndOnDropCallBack(self.tableObj);
        }
    },self.table);
}

tableControl.prototype.setOrder = function(){
    let self = this;
    $.each(self.table.find('tbody tr'),function(){
        let prefix = ((this.id).split('_'))[0];
        let id = ((this.id).split('_'))[1];
        if(prefix == 'row'){
            if(self.tableObj.hasOwnProperty(id)){
                self.tableObj[id]['order'] = (this.rowIndex - 1);
                this.id = 'row_'+(this.rowIndex - 2);
            } else {
                self.reOrder();
                this.id = 'row_'+(this.rowIndex - 2);
            }
        }
    })
    self.tableObj = _.sortBy( self.tableObj, 'order' );
}
tableControl.prototype.reOrder = function(){
    let self = this;
    $.each(self.tableObj,function(k,v){
        self.tableObj[k].order = (k+1);
    });
}

tableControl.prototype.redraw = function(){
    let self = this;
    self.table.find('tbody').find("tr:gt(0)").remove();
    self.addRowConceptos(self.tableObj);
}

tableControl.prototype.updateByPosition = function(index,obj){
    let self = this;
    self.tableObj[index] = obj;
}