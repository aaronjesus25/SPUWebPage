/**
 * Clase para manejar las vistas. 
 * @param {} idButtonView 
 * @param {} idTable 
 * @param {} idDivTable 
 * @param {} idForm 
 * @param {} idDivForm 
 * @returns {} 
 */
var Forms = function (idButtonView, idTable, idDivTable, idForm, idDivForm) {
    var self = this;

    //Se declaran las propiedades necesarias
    self.IsvisibleGlobal = true;
    self.InputsValues = {};
    self.idButtonView = idButtonView !== "undefined" && idButtonView.indexOf("#") === 0 ? idButtonView : "#" + idButtonView;
    self.idForm = idForm !== "undefined" && idForm.indexOf("#") === 0 ? idForm : "#" + idForm;
    self.idTable = idTable !== "undefined" && idTable.indexOf("#") === 0 ? idTable : "#" + idTable;
    self.idDivTable = idDivTable !== "undefined" && idDivTable.indexOf("#") === 0 ? idDivTable : "#" + idDivTable;
    self.idDivForm = idDivForm !== "undefined" && idDivForm.indexOf("#") === 0 ? idDivForm : "#" + idDivForm;
    self.operation = 'create';
    self.SelectedValues = [];
    self.isvisibleForm = false;
    self.IsvisibleTable = true;
    self.selectall = false;
    self.selectedMultipleValues = null;
    self.deselectedMultipleValues = null;
    self.my_select_groups = "#my-select-groups";
    self.WebApiUrl = "http://servicios.quro.com.mx/api/";//"http://192.168.1.45:9010/api/;

    /**
     * Inicializador de propiedades
     *
     */
    self.Init = function () {
        self.IsvisibleGlobal = true;
        self.InputsValues = {};
        self.VisibleFrameForm(self.isvisibleForm);
        self.VisibleFrameTable(self.isvisibleForm);
        self.ButtonCheckAll();
        self.ShowForm();
        self.HideForm();
        self.DeleteRowSelection();
        self.InitSpinner();
        self.getSelectedValues();
    };

    /**
     * Se inicializa el selector de fechas para el formulario de la vista
     * Se deben pasar los identificadores en un arreglo.
     * @param {Array} idsArray 
     */
    self.InitializeDatePicker = function (idsArray) {
        idsArray = idsArray || [];
        if (idsArray instanceof Array) {
            for (var id in idsArray) {
                idsArray[id] = idsArray[id].indexOf("#") === 0 ? idsArray[id] : "#" + idsArray[id];
                $(idsArray[id]).datetimepicker({
                    timepicker: false,
                    format: 'd/m/Y',//'Y-m-d',
                    formatDate: 'd/m/Y'
                });
            }
        } else if (typeof idsArray === 'string') {
            idsArray = idsArray.indexOf("#") === 0 ? idsArray : "#" + idsArray;
            $(idsArray).datetimepicker({
                timepicker: false,
                format: 'd/m/Y',//'Y-m-d',
                formatDate: 'd/m/Y'
            });
        } else {
            console.log("No se ha enviado un identificador válido");
        }
    };

    /**
     * Función para ocultar la tabla que lista los registros de la vista actual
     * Se debe pasar el identificador del boton al que se hará click para ocultar
     * y el identificador de la tabla o div a ocultar.
     */
    self.VisibleFrameTable = function () {
        //idButton = idButton !== "undefined" && idButton.indexOf("#") === 0 ? idButton : "#" + idButton;
        //idTable = idTable !== "undefined" && idTable.indexOf("#") === 0 ? idTable : "#" + idTable;

        if (typeof self.idDivTable === "string" && typeof self.idButtonView === "string") {
            $(self.idButtonView).click(function () {
                if (self.isVisibleTable) {
                    $(self.idDivTable).hide(1000);
                    $(self.idButtonView).removeClass('fa fa-eye');
                    $(self.idButtonView).addClass('fa fa-eye-slash');
                    self.isVisibleTable = false;
                } else {
                    $(self.idDivTable).show(1000);
                    $(self.idButtonView).removeClass('fa fa-eye-slash');
                    $(self.idButtonView).addClass('fa fa-eye');
                    self.isVisibleTable = true;
                }
            });
        }

    };

    self.SetFrameTable = function (band) {
        var band = band | false;
        //idButton = idButton !== "undefined" && idButton.indexOf("#") === 0 ? idButton : "#" + idButton;
        //idTable = idTable !== "undefined" && idTable.indexOf("#") === 0 ? idTable : "#" + idTable;
        if (band) {
            $(self.idDivTable).show(1000);
            $(self.idButtonView).removeClass('fa fa-eye-slash');
            $(self.idButtonView).addClass('fa fa-eye');
            self.isVisibleTable = true;
        } else {
            $(self.idDivTable).hide(1000);
            $(self.idButtonView).removeClass('fa fa-eye');
            $(self.idButtonView).addClass('fa fa-eye-slash');
            self.isVisibleTable = false;
        }


    };

    /**
     * Para el uso de esta función se debe tener JAlert
     * La función se encarga de generar el error
     * @param {string} text 
     * @param {string} type 
     * @param {string} title
     */
    self.generatePopupAlert = function (text, type, title) {
        title = "Aviso";
        type = type || "error";
        text = text || "";

        var messagehtml = "<strong>" + text + "</strong>";
        if (type === "success") {
            //successAlert(title, messagehtml);
            swal({
                title: title,
                text: messagehtml,
                type: type,
                timer: 7000,
                html: true
            });
        } else if (type === "warning") {
            swal({
                title: title,
                text: messagehtml,
                type: type,
                timer: 7500,
                html: true
            });
        } else if (type === "error") {
            swal({
                title: title,
                text: messagehtml,
                type: type,

                html: true
            });
        }
    };

    /**
     * Para utilizar esta función se debe tener instalado noty, para generar las alertas
     * Genera una alerta en el top de la web
     * @param {string} text 
     * @param {string} type 
     */
    self.generateNotification = function (text, type) {
        var layout = "top";
        var theme = "defaultTheme";
        var timeoutnoty = false;
        var valuespeed = 0;
        var closenotify = ["button"];
        if (type !== "error") {
            valuespeed = 3500;
            timeoutnoty = true;
            closenotify = [];
        }
        noty({
            text: text,
            type: type,
            dismissQueue: true,
            animation: {
                open: { height: 'toggle' },
                close: { height: 'toggle' },
                easing: 'swing',
                speed: valuespeed
            },
            timeout: timeoutnoty,
            layout: layout,
            theme: theme,
            maxVisible: 1,
            closeWith: closenotify
        });
    };

    /**
     * Se encarga de inicializar el boton de motificar y editar
     * @returns {} 
     */
    self.IsButtonWarning = function () {
        $('#create_modify').removeClass('btn-success');
        $('#create_modify').addClass('btn-warning');
        $('#create_modify').text("");
        $('#create_modify').append("<i class='fa fa-pencil-square-o'></i> Modificar");
        $('#create_modify').removeClass('disabled');
        $('#save').removeClass('btn-success');
        $('#save').addClass('btn-warning');
        $('#save').text("");
        $('#save').append("<i class='fa fa-pencil-square-o'></i> Guardar");
        $('#save').removeClass('disabled');
        self.operation = "modify";
    };

    /**
     * Se encarga de inicializar el boton de crear y guardar
     * @returns {} 
     */
    self.isButtonSuccess = function () {
        $('#create_modify').removeClass('disabled');
        $('#create_modify').removeClass('btn-warning');
        $('#create_modify').addClass('btn-success');
        $('#create_modify').text("");
        $("#create_modify").append("<i class='fa fa-male'></i> Crear");
        $('#save').removeClass('disabled');
        $('#save').removeClass('btn-warning');
        $('#save').addClass('btn-success');
        $('#save').text("");
        $("#save").append("<i class='fa fa-save'></i> Guardar");
        self.operation = "create";
    };

    /**
     * Función que obtiene los valores de los campos input del formulario de la vista
     * @returns {Object} 
     */
    self.getInputsFormValues = function () {
        var $selectedGroup = null;
        var $selectedClasificacion = null;
        var $selectedSubClasificacion = null;
        var $GenerarAlerta = null;
        //var $EmailAlertas = null;
        var _idForm = self.idForm + " :input";
        $selectedGroup = $("#group option:selected");
        $selectedClasificacion = $("#Clasificacion");
        //$selectedSubClasificacion = $("#Clasificacion5");
        $GenerarAlerta = $("#GenerarAlerta");
        // $EmailAlertas = $("#emailAlerts");
        //#emailAlerts
        var $inputs = $(_idForm);

        self.InputsValues = {};

        $inputs.each(function () {
            if (this.name) {
                self.InputsValues[this.name] = $(this).val();
            }
        });

        if (self.selectedMultipleValues !== null) {
            self.InputsValues["Groups"] = self.selectedMultipleValues;
        }
        if (!_.isUndefined($selectedGroup) && !_.isNull($selectedGroup) && !_.isEmpty($selectedGroup) && $selectedGroup.val()) {
            self.InputsValues["GrupoUid"] = $selectedGroup.val();
        }

        $selectedClasificacion = $("#Clasificacion option:selected");
        if (!_.isUndefined($selectedClasificacion) && !_.isNull($selectedClasificacion) && !_.isEmpty($selectedClasificacion) && $selectedClasificacion.val()) {
            self.InputsValues["ClasificacionUid"] = $selectedClasificacion.val();
            //self.InputsValues["ClasificacionUID"] = $selectedClasificacion.val();
        }

        self.InputsValues["GenerarAlerta"] = $GenerarAlerta.is(":checked");

        $selectedSubClasificacion = $("#SubClasificacion option:selected");
        if (!_.isUndefined($selectedSubClasificacion) && !_.isNull($selectedSubClasificacion) && !_.isEmpty($selectedSubClasificacion) && $selectedSubClasificacion.val()) {
            self.InputsValues["SubClasifiacionUID"] = $selectedSubClasificacion.val();
        }

        //Get a day for geofence
        var $checks = $("#dias-checks input:checked");
        var dias = "";
        $checks.each(function () {
            dias += this.value + ",";
        });

        self.InputsValues["DiasVisita"] = dias;

        return self.InputsValues;
    };

    /**
     * Función que oculta o hace visible el formulario de la vista
     * @param {bool} isVisible 
     * @returns {} 
     */
    self.VisibleFrameForm = function (isVisible) {
        if (isVisible) {
            $(self.idDivForm).show(1000);
        } else {
            $(self.idDivForm).hide(1000);
        }
    }

    /**
     * Función que al hacer click al boton create_modify muestra el formulario,
     * se le puede pasar una función que se ejecutará despues de hacer visible el formulario
     * @param {Function} callback 
     * @returns {} 
     */
    self.ShowForm = function (callback) {
        $("#create_modify").click(function () {
            var callb = callback;
            if ($(this).hasClass('disabled')) {
                //event.preventDefault
                self.OperationType(self.operation, callb);
                return;
            } else {
                self.OperationType(self.operation, callb);
            }
        });
    };

    /**
     * Función que se encarga de ocultar el formulario y hacer un reset del mismo.
     * Se puede pasar una función que se ejecutará al final de su función.
     * @returns {} 
     */
    self.HideForm = function (callback) {
        $("#cancel").click(function () {
            $('#create_modify').removeClass('disabled');
            $('#checkall').removeClass('disabled');
            self.VisibleFrameForm(false);
            //self.resetForm();
            self.getSelectedValues();
            if (typeof callback !== "undefined" && typeof callback === "function") {
                callback();
            }
        });
    };

    self.ResetControls = function () {
        $('#create_modify').removeClass('disabled');
        $('#checkall').removeClass('disabled');
        self.VisibleFrameForm(false);
        //self.resetForm();
        self.getSelectedValues();
    }

    /**
     * Función que inicializa el evento click del botón eliminar.
     * Para poder funcionar debe recibir los parametros endpoint, callback y values (opcional). Sino se reciben
     * los valores se toman por default de los seleccionados de la tabla.
     * @param {string} endPoint - recibe la url a llamar
     * @param {function} callback - recibe una función que se ejecuta al finalizar con exito la petición
     * @param {Array} values - Opcional. Los registros a eliminar.
     * @returns {} 
     */
    self.DeleteRowSelection = function (endPoint, callback, values) {
        var url = endPoint;
        var callb = callback;
        var val = values;
        $(self.idDivTable)
            .off("click", "#delete");
        $("#delete").click(function () {
            if ($(this).hasClass('disabled')) {
                event.preventDefault();
                return;
            }
            if (typeof endPoint !== "undefined" && typeof callback === "function") {
                self.operation = "delete";
                val = self.getSelectedValues();
                self.BeforeADeleteAjax(url, callb, val);
            } else {
                console.log("No se ha registrado la url, el callback y los valores");
            }
        });
    };

    /**
     * 
     * @param {any} endPoint
     * @param {any} callback
     * @param {any} values
     */
    self.DeleteRow = function (endPoint, callback) {
        var url = endPoint;
        $(self.idDivTable)
            .off("click", "#delete");
        $("#delete").click(function () {
            if ($(this).hasClass('disabled')) {
                event.preventDefault();
                return;
            }
            if (typeof endPoint !== "undefined" && typeof callback === "function") {
                self.operation = "delete";
                var val = self.getSelectedValues();
                var text = '';
                text = '<strong>¿Desea eliminar el registro?</strong>';
                $.jAlert({
                    'theme': 'yellow',
                    'type': 'confirm',
                    'confirmQuestion': text,
                    'confirmBtnText': 'Si',
                    'denyBtnText': 'No',
                    'onConfirm': function () {

                        self.ExecuteAjax(url, callback, val);
                    }
                });
            } else {
                console.log("No se ha registrado la url, el callback y los valores");
            }
        });
    };

    /**
     * 
     * @param {any} endPoint
     * @param {any} callback
     * @param {any} values
     */
    self.DeleteRowArray = function (endPoint, callback) {
        var url = endPoint;
        $(self.idDivTable)
            .off("click", "#delete");
        $("#delete").click(function () {
            if ($(this).hasClass('disabled')) {
                event.preventDefault();
                return;
            }
            if (typeof endPoint !== "undefined" && typeof callback === "function") {
                self.operation = "delete";
                val = self.getSelectedValues();
                var text = '';
                text = '<strong>¿Desea eliminar el registro?</strong>';
                $.jAlert({
                    'theme': 'yellow',
                    'type': 'confirm',
                    'confirmQuestion': text,
                    'confirmBtnText': 'Si',
                    'denyBtnText': 'No',
                    'onConfirm': function () {

                        self.ExecuteAjax(url, callback, val[0]);
                    }
                });
            } else {
                console.log("No se ha registrado la url, el callback y los valores");
            }
        });
    };

    /**
     * Función que realiza la acción dependiendo del tipo de operación, create (hace visible el formulario
     * para agregar), modify (hace visible el formulario para editar), save (guarda los datos en la bd),
     * savemodify (guarda los datos editados en la bd), delete (elimina los datos de la bd).
     * De igual forma, puede recibir una función que se ejecutará despues de hacer visible el formulario.
     * @param {string} operation
     * @param {function} callback
     */
    self.OperationType = function (operation, callback) {
        switch (operation) {
            case "create":
                self.VisibleFrameForm(true);
                self.IsButtonSuccessDisabled();
                if (typeof callback !== "undefined" && typeof callback === "function") {
                    callback();
                }
                break;
            case "modify":
                self.VisibleFrameForm(true);
                self.SetInfoToForm();
                if (typeof callback !== "undefined" && typeof callback === "function") {
                    callback();
                }

                //ShowUpdateData();
                break;
            case "delete":
                self.BeforeADeleteAjax(operation);
                if (typeof callback === "function") {
                    callback();
                }
                break;
            default:
                self.VisibleFrameForm(false);
                self.resetForm();
                self.VisibleButtonsOperations(false);
                break;
        }
    };

    self.BeforeADeleteAjax = function (endPoint, callback, values) {
        var countselection = values.length;
        var text = '';
        text = countselection > 1 ? '<strong>¿Desea eliminar los ' + countselection + ' registros?</strong>' : '<strong>¿Desea eliminar el registro?</strong>';
        $.jAlert({
            'theme': 'yellow',
            'type': 'confirm',
            'confirmQuestion': text,
            'confirmBtnText': 'Si',
            'denyBtnText': 'No',
            'onConfirm': function () {
                self.ExecuteDeleteAjax(endPoint, callback, values);
            }
        });
    }

    /**
     * Deshabilita el boton de modificar o crear
     * @returns {} 
     */
    self.IsButtonSuccessDisabled = function () {
        $('#create_modify').removeClass('disabled');
        $('#create_modify').addClass('disabled');
    }



    /**
     * Función que devuelve un arreglo de objetos, los objetos contienen los valores de cada registro seleccionado
     * en la tabla
     * @returns {} 
     */
    self.getSelectedValues = function () {
        var values = [];
        var heads = $(self.idTable).find('tr').eq(0).find('th');
        $.each($(self.idTable + " input:checked"), function (y, d, c) {
            $(this).parents('tr').each(function (a, b) {
                var tdValues = {};
                $(this).find('td').each(function (col, b) {
                    //values[this.data-dynatable-column] = $(this).val();
                    var txt = $(this).text();
                    var band = heads.eq(col).data().dynatableColumn.search(/^Imagen+/);

                    if (band !== -1) {
                        var img_value = $(this).html();
                        var regex1 = '<img height="16" width="32" src="';
                        var x = img_value.indexOf(regex1);
                        var y = img_value.indexOf('">');
                        var img_substring = img_value.substring(regex1.length, y);
                        tdValues[heads.eq(col).data().dynatableColumn] = img_substring;
                    } else {
                        if (txt) {
                            tdValues[heads.eq(col).data().dynatableColumn] = txt;

                        }
                    }

                });
                values.push(tdValues);
            });
        });
        self.SelectedValues = values;
        self.ActiveButtons(values);
        return values;
    };

    /**
     * 
     * @returns {} 
     */
    self.IsButtonOperationsDisabled = function () {
        $('#modify_status').removeClass('disabled');
        $('#modify_status').addClass('disabled');

        $('#delete').removeClass('disabled');
        $('#delete').addClass('disabled');
    }

    /**
     * Activa o desactiva los botones del formulario dependiendo de la cantidad de registros seleccionados.
     * Un registro se habilita modificar y eliminar, mas de un registro solo habilita el botón eliminar.
     * @param {Array} values - Los valores seleccionados de la tabla. Arreglo de objetos 
     * @returns {} 
     */
    self.ActiveButtons = function (values) {
        var amount = values.length;
        if (amount > 0) {
            self.VisibleFrameForm(false);
            self.resetForm();

            $('#modify_status').removeClass('disabled');
            $('#delete').removeClass('disabled');

            if (amount > 1) {
                $('#create_modify').addClass('disabled');
                $('#permissions').addClass('disabled');
                $('#checkall').removeClass('disabled');

                self.VisibleButtonsOperations(true);

            } else if (amount === 1) {
                self.IsButtonWarning();
                self.VisibleButtonsOperations(true);
            }
        } else {

            self.isButtonSuccess();
            self.VisibleFrameForm(false);
            self.resetForm();
            self.VisibleButtonsOperations(false);
        }

    };


    self.VisibleButtonsOperations = function (isVisible) {
        if (isVisible) {
            $("#modify_status").show(1000);
            $("#delete").show(1000);
        } else {
            $("#modify_status").hide(1000);
            $("#delete").hide(1000);
        }
    };

    /**
     * Función que elimina las clases y labels que agrega el validador de formularios
     * 
     */
    self.resetForm = function () {
        $(self.idForm).each(function () {
            this.reset();
            $(this).find(':input').each(function (a, b) {
                var $id = "#" + $(this).attr('id');
                $(this).removeClass('errorwarnig');
                $(self.idForm).find($id + "-error").remove();
            });
            self.InitMultipleSelected();
        });
    };

    /**
     * Función que activa el botón para seleccionar todos los checks de la tabla
     * @param {string} idButtonCheckAll - identificador del boton 
     */
    self.ButtonCheckAll = function (idButtonCheckAll) {
        idButtonCheckAll = idButtonCheckAll || "#checkall";
        idButtonCheckAll = idButtonCheckAll !== "undefined" && idButtonCheckAll.indexOf("#") === 0 ? idButtonCheckAll : "#" + idButtonCheckAll;
        $(idButtonCheckAll).click(function () {
            if ($(this).hasClass('disabled')) {
                event.preventDefault();
                return;
            }
            var ischeckall = self.SelectCheckAll(self.selectall);
            self.selectall = ischeckall;
            self.ChangeTextButtonChekAll(self.selectall, idButtonCheckAll);
        });
    };



    /**
     * Función que cambia el texto del boton seleccionar checks
     * @param {bool} isCheckAll 
     * @param {string} idButtonCheckAll - identificador del boton para seleccionar todos los checks
     * @returns {} 
     */
    self.ChangeTextButtonChekAll = function (isCheckAll, idButtonCheckAll) {
        var $idButtonCheckAll = $(idButtonCheckAll);
        $idButtonCheckAll.text("");
        if (isCheckAll) {
            $idButtonCheckAll.append("<i class='fa fa-list'></i> Deselec. Todos");
        } else {
            $idButtonCheckAll.append("<i class='fa fa-list'></i> Selec. Todos");
        }

        self.selectall = isCheckAll;
    };

    self.SelectCheckAll = function () {
        var checkall = self.selectall;
        if (checkall) {
            checkall = false;
        } else {
            checkall = true;
        }
        $(self.idTable + ' input:checkbox').prop('checked', checkall);
        self.getSelectedValues();

        return checkall;
    }

    /**
     * Agrega la información del checkbox seleccionado a los campos del formulario.
     * @returns {} 
     */
    self.SetInfoToForm = function () {
        debugger;
        var values = self.SelectedValues[0];
        var $selectedGroup = null;
        var $selectClasificacion = null;
        var $selectSubClasificacion = null;
        var $CheckGeocerca = null;
        var $CheckEmail = null;
        var _idForm = self.idForm + " :input";
        $selectedGroup = $("#group");

        $CheckEmail = $("#emailAlerts");
        $CheckGeocerca = $("#GenerarAlerta");
        $selectClasificacion = $("#Clasificacion");
        $selectSubClasificacion = $("#SubClasificacion");


        $img_select = $("#img_vehicles");
        var $inputs = $(_idForm);

        self.InputsValues = {};

        $inputs.each(function () {
            if (this.name) {
                $(this).val(values[this.name]);
            }

            if (this.name == 'FechaAdquisicion') {

                var date = values['FechaAdquisicionView'].split('/');

                $(this).val(date[2] + '/' + date[1] + '/' + date[0]);

                debugger;
            }

            if (this.name == 'FechaVencimiento') {

                var date = values['FechaVencimientoView'].split('/');

                $(this).val(date[2] + '/' + date[1] + '/' + date[0]);

            }

            if (this.name == "taller") {
                var x = values[this.name];
                if (x === "true") {
                    document.getElementById(this.name).checked = true;
                } else {
                    document.getElementById(this.name).checked = false;
                }
            }
        });

        if (self.selectedMultipleValues != null) {
            self.SetMultipleSelected();
        }
        if (!_.isUndefined($img_select) && !_.isNull($img_select) && !_.isEmpty($img_select) && typeof $img_select.selectator === "function") {
            $img_select.val(values["ImagenVehiculo"]).prop('selected', true);
            $img_select.selectator('refresh');
        }
        if (!_.isUndefined($selectedGroup) && !_.isNull($selectedGroup) && !_.isEmpty($selectedGroup)) {
            $selectedGroup.val(values["GrupoUid"]).prop('selected', true);
        }
        /*Clasificacion*/
        if (!_.isUndefined($selectClasificacion) && !_.isNull($selectClasificacion) && !_.isEmpty($selectClasificacion)) {
            $selectClasificacion.val(values["ClasificacionUid"]).prop('selected', true);
            // $selectClasificacion.val(values["ClasificacionUID"]).prop('selected', true);
        }
        /*SSubClasificacion*/
        if (!_.isUndefined($selectSubClasificacion) && !_.isNull($selectSubClasificacion) && !_.isEmpty($selectSubClasificacion)) {
            $selectSubClasificacion.val(values["SubClasifiacionUID"]).prop('selected', true);
        }

        if (!_.isUndefined($CheckGeocerca) && !_.isNull($CheckGeocerca) && !_.isEmpty($CheckGeocerca)) {

            if (values["GenerarAlerta"] == "true" || values["GenerarAlerta"] == "True") {
                $CheckGeocerca.prop('checked', true);
            }
            else {
                $CheckGeocerca.prop('checked', false);
            }

        }

        //  emailAlerts;

        if (!_.isUndefined($CheckEmail) && !_.isNull($CheckEmail) && !_.isEmpty($CheckEmail)) {

            if (values["SendEmail"] == "true" || values["SendEmail"] == "True") {
                $CheckEmail.prop('checked', true);
            }
            else {
                $CheckEmail.prop('checked', false);
            }

        }
        var valuesd = values["DiasVisita"];

        if (!_.isUndefined(valuesd) && !_.isNull(valuesd) && !_.isEmpty(valuesd)) {

            $dias = $('#dias-checks input:checkbox');
            $label = $("#dias-checks label");
            $dias.prop('checked', false);


            valuesd = valuesd.split(",");
            valuesd = _.without(valuesd, "");


            $("#dias-checks label").each(function (a, b) {
                var $child = $(this).children();
                var m = $child.val();
                if (_.find(valuesd, function (dia) { return dia === m; })) {
                    $child.prop('checked', true);
                    $(this).addClass("active");
                }

            });
        }





    };












    self.Save = function (operation, endPoint, callback, values) {
        values = values || self.getInputsFormValues();
        switch (operation) {
            case 'save':
                break;
            case 'save_modify':
                self.ExceuteUpdateAjax(endPoint, callback, values);
                break;
            default:
                self.VisibleFrameForm(false);
                self.resetForm();
                self.VisibleButtonsOperations(false);
                break;
        }

    };

    /**
     * 
     * @param {string} endPoint - url tipo /Cliente/Update
     * @param {function} callback - función que se ejecuta si la petición tuvo éxito y debe refrescar la tabla
     * @param {object} values -  objeto formado con los datos del formulario, deben tener los mismos nombres que en el modelo
     * @returns {} 
     */
    self.ExecuteUpdateAjax = function (endPoint, callback, values) {
        values = values || self.getInputsFormValues();
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(values),
            async: true,
            beforeSend: function () {
                $.spin('true');
            },
            url: endPoint,
            success: function (data) {
                if (typeof data !== "undefined" && data !== null) {
                    if ((!_.isNull(data.ShowMessage) && !_.isEmpty(data.ShowMessage)) && (!_.isNull(data.TypeMessage) && !_.isEmpty(data.TypeMessage))) {
                        var text = data.ShowMessage;
                        var typetext = data.TypeMessage;
                        self.generatePopupAlert(text, typetext);
                        if (data.IsEmpty === false) {
                            callback();
                            self.resetForm();
                            self.VisibleFrameForm(false);
                            self.VisibleButtonsOperations(false);
                            self.isButtonSuccess();

                        }
                    } else {
                        alert("Error de conexion")
                    }

                }
            },
            error: function (xhr) {
                self.generateNotification('Imposible consumir WS, verifique su conexión ' + xhr.responseText, "error");
            }
        }).always(function () {
            $.spin('false');
        });
    };

    /**
    * 
    * @param {string} endPoint - url tipo /Cliente/Update
    * @param {function} callback - función que se ejecuta si la petición tuvo éxito y debe refrescar la tabla
    * @param {object} values -  objeto formado con los datos del formulario, deben tener los mismos nombres que en el modelo
    * @returns {} 
    */
    self.ExecuteUpdateAjaxMultipart = function (endPoint, callback, values) {
        values = values || self.getInputsFormValues();
        $.ajax({
            type: 'POST',
            processData: false,
            contentType: false,
            cache: false,
            data: values,
            //dataType: "json",
            async: false,
            beforeSend: function () {
                $.spin('true');
            },
            url: endPoint,
            success: function (data) {
                if (typeof data !== "undefined" && data !== null) {
                    var text = data.ShowMessage;
                    var typetext = data.TypeMessage;
                    self.generatePopupAlert(text, typetext);
                    if (data.IsEmpty === false) {
                        callback();
                        self.resetForm();
                        self.VisibleFrameForm(false);
                        self.VisibleButtonsOperations(false);
                        self.isButtonSuccess();

                    }
                }
            },
            error: function (xhr) {
                self.generateNotification('Imposible consumir WS, verifique su conexión ' + xhr.responseText, "error");
            }
        }).always(function () {
            $.spin('false');
        });
    };


    /**
     * 
     * @param {string} endPoint - url tipo /Cliente/Update
     * @param {function} callback - función que se ejecuta si la petición tuvo éxito y debe refrescar la tabla
     * @param {object} values -  objeto formado con los datos del formulario, deben tener los mismos nombres que en el modelo
     * @returns {} 
     */
    self.ExecuteCreateAjax = function (endPoint, callback, values) {
        values = values || self.getInputsFormValues();
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(values),
            async: true,
            beforeSend: function () {
                $.spin('true');
            },
            url: endPoint,
            success: function (data) {
                if (typeof data !== "undefined" && data !== null) {
                    if ((!_.isNull(data.ShowMessage) && !_.isEmpty(data.ShowMessage)) && (!_.isNull(data.TypeMessage) && !_.isEmpty(data.TypeMessage))) {
                        var text = data.ShowMessage;
                        var typetext = data.TypeMessage;
                        self.generatePopupAlert(text, typetext);
                        if (data.IsEmpty === false) {
                            if (typeof callback === "function") {
                                callback();
                            }
                            self.resetForm();
                        }
                    } else {
                        window.location = "http://gps.quro.com.mx/Account/Login";
                    }

                    //VisibleLoadingTable(false);
                }
            },
            error: function (xhr) {
                self.generateNotification('No se han podido consumir los datos, verifique su conexión ' + xhr.responseText, "error");
            }
        }).always(function () {
            $.spin('false');
        });
    };

    self.AjaxPdf = function (endPoint, nombre, values) {
        var request = new XMLHttpRequest();
        request.open('POST', endPoint, true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.responseType = 'blob';
        request.onloadstart = function () {
            $.spin('true');
        };
        request.onloadend = function () {
            $.spin('false');
        };
        request.onload = function () {
            if (request.status === 200) {
                var disposition = request.getResponseHeader('content-disposition');
                var matches = /"([^"]*)"/.exec(disposition);
                var filename = (matches !== null && matches[1] ? matches[1] : nombre + '.pdf');
                var blob = new Blob([request.response], { type: 'application/pdf' });
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        };
        request.send(values);
    }

    self.ExecuteAjax = function (endPoint, callback, values, noti = true) {
        $.ajax({
            type: 'POST',
            data: values,
            async: true,
            url: endPoint,
            beforeSend: function (xhr) {
                if ($.spin !== null) {
                    $.spin('true');
                }
            }
        })
            .done(function (data) {
                if (typeof data !== "undefined" && data !== null) {
                    var text = data.Message;
                    if (data.Success == true) {
                        if (noti !== false) {
                            self.generatePopupAlert(text, "success");
                        }
                    }
                    else {
                        if (noti !== false) {
                            self.generatePopupAlert(text, "warning");
                        }
                    }
                    if (typeof callback === "function") {
                        callback(data);
                    }
                }
            })
            .fail(function (data) {
                self.generateNotification('No se han podido consumir los datos, verifique su conexión ' + data.responseText, "error");

            })
            .always(function (data) {
                $.spin('false');
            });

    };

    self.ExecuteGet = function (endPoint, callback, noti = true) {
        $.ajax({
            type: 'GET',
          
            async: true,
            url: endPoint,
            beforeSend: function (xhr) {
                if ($.spin !== null) {
                    $.spin('true');
                }
            }
        })
            .done(function (data) {
                if (typeof data !== "undefined" && data !== null) {
                    var text = data.Message;
                    if (data.Success == false) {
                        if (noti !== false) {
                            self.generatePopupAlert(text, "warning");
                        }
                    }
                    
                    if (typeof callback === "function") {
                        callback(data);
                    }
                }
            })
            .fail(function (data) {
                self.generateNotification('No se han podido consumir los datos, verifique su conexión ' + data.responseText, "error");

            })
            .always(function (data) {
                $.spin('false');
            });

    };

    /**
    * 
    * @param {string} endPoint - url tipo /Cliente/Update
    * @param {function} callback - función que se ejecuta si la petición tuvo éxito y debe refrescar la tabla
    * @param {object} values -  objeto formado con los datos del formulario, deben tener los mismos nombres que en el modelo
    * @returns {} 
    */
    self.ExecuteCreateAjaxMultipart = function (endPoint, callback, values) {
        values = values || self.getInputsFormValues();
        $.ajax({
            type: 'POST',
            processData: false,
            contentType: false,
            cache: false,
            data: values,
            beforeSend: function () {
                $.spin('true');
            },
            url: endPoint,
            success: function (data) {
                if (typeof data !== "undefined" && data !== null) {
                    var text = data.ShowMessage;
                    var typetext = data.TypeMessage;
                    self.generatePopupAlert(text, typetext);
                    if (data.IsEmpty === false) {
                        if (typeof callback === "function") {
                            callback();
                        }
                        self.resetForm();
                    }
                    //VisibleLoadingTable(false);
                }
            },
            error: function (xhr) {
                self.generateNotification('No se han podido consumir los datos, verifique su conexión ' + xhr.responseText, "error");
            }
        }).always(function () {
            $.spin('false');
        });
    };

    /**
     * Recibe un endpoint, una función que se ejecuta al eliminar el último elemento del array de objetos y
     * un arreglo de objetos, los cuales se capturan mediante los checkbox marcados.
     * @param {string} endPoint 
     * @param {function} callback 
     * @param {Array} values 
     * @returns {} 
     */
    self.ExecuteDeleteAjax = function (endPoint, callback, values) {
        values = values || self.getSelectedValues();
        //VisibleLoadingTable(true);
        self.IsButtonOperationsDisabled();
        var countcicle = 0;
        var countarray = values.length;
        for (var value in values) {
            var jsoninfo = JSON.stringify(values[value]);
            $.ajax({
                type: 'POST',
                contentType: 'application/json',
                beforeSend: function () {
                    $.spin('true');
                },
                data: jsoninfo,
                async: true,
                url: endPoint,
                success: function (data) {
                    countcicle += 1;
                    if (typeof data !== "undefined" && data !== null) {
                        if (!_.isEmpty(data) && (!_.isNull(data.ShowMessage) && !_.isEmpty(data.ShowMessage)) && (!_.isNull(data.TypeMessage) && !_.isEmpty(data.TypeMessage))) {
                            if (countcicle === countarray) {
                                var text = data.ShowMessage;
                                var typetext = data.TypeMessage;
                                self.generatePopupAlert(text, typetext);
                                if (data.IsEmpty === false) {
                                    if (typeof callback === "function") {
                                        callback();
                                    }
                                    self.VisibleButtonsOperations(false);
                                    self.isButtonSuccess();
                                    self.ChangeTextButtonChekAll(false);
                                }
                                if (typeof callback === "function") {
                                    callback();
                                }
                            }
                        } else {
                            window.location = "http://gps.quro.com.mx/Account/Login";
                        }
                    }
                },
                error: function (xhr) {
                    self.generateNotification('Imposible consumir WS, verifique su conexión ' + xhr.responseText, "error");
                }
            }).always(function () {
                $.spin('false');
            });
        }
    };

    self.InitMultipleSelected = function (values) {
        var $mySelect = $('#my-select-groups');
        if (typeof $mySelect.multiSelect === "function") {
            self.deselectedMultipleValues = [];
            var $mySelectOptions = $('#my-select-groups option');
            $mySelectOptions.each(function (a, b) {
                self.deselectedMultipleValues.push(this.value);
            });
            console.log(self.deselectedMultipleValues);
            if (self.selectedMultipleValues !== null && self.deselectedMultipleValues !== null)
                $mySelect.multiSelect('deselect', self.deselectedMultipleValues);
            self.selectedMultipleValues = [];

            $mySelect.multiSelect({
                afterSelect: multipleSelected,
                afterDeselect: multipleDeselected,
                selectableHeader: "<div class='custom-header'>No seleccionados</div>",
                selectionHeader: "<div class='custom-header'>Seleccionados</div>"
            });
        }
    };

    self.SetMultipleSelected = function (values) {
        values = values || []
        for (var v in values) {
            if (values.hasOwnProperty(v)) {
                self.selectedMultipleValues.push(values[v].GrupoUid);
            }
        }
        $('#my-select-groups').multiSelect('select', self.selectedMultipleValues);
        $('#my-select-groups').multiSelect('refresh');
    };

    function multipleSelected(value) {
        self.selectedMultipleValues.push(value[0]);
    }

    function multipleDeselected(value) {
        self.selectedMultipleValues = _.without(self.selectedMultipleValues, value[0]);
    }

    /**
     * Funcion que inicializa el spinner, para dar un efecto de espera cuando se hace uso de ajax
     * 
     */
    self.InitSpinner = function () {
        (function ($) {
            $.extend({
                spin: function (spin, opts) {

                    if (opts === undefined) {
                        opts = {
                            lines: 13, // The number of lines to draw
                            length: 20, // The length of each line
                            width: 10, // The line thickness
                            radius: 30, // The radius of the inner circle
                            corners: 1, // Corner roundness (0..1)
                            rotate: 0, // The rotation offset
                            direction: 1, // 1: clockwise, -1: counterclockwise
                            color: '#000', // #rgb or #rrggbb or array of colors
                            speed: 1, // Rounds per second
                            trail: 56, // Afterglow percentage
                            shadow: false, // Whether to render a shadow
                            hwaccel: false, // Whether to use hardware acceleration
                            className: 'spinner', // The CSS class to assign to the spinner
                            zIndex: 2e9, // The z-index (defaults to 2000000000)
                            top: '50%', // Top position relative to parent
                            left: '50%' // Left position relative to parent
                        };
                    }

                    var data = $('body').data();

                    if (data.spinner) {
                        data.spinner.stop();
                        delete data.spinner;
                        $("#spinner_modal").remove();
                        return this;
                    }

                    if (spin) {

                        var spinElem = this;

                        $('body').append('<div id="spinner_modal" style="background-color: rgba(0, 0, 0, 0.3); width:100%; height:100%; position:fixed; top:0px; left:0px; z-index:' + (opts.zIndex - 1) + '"/>');
                        spinElem = $("#spinner_modal")[0];

                        data.spinner = new Spinner($.extend({
                            color: $('body').css('color')
                        }, opts)).spin(spinElem);
                    }
                    return "";
                }
            });
        })(jQuery);
    };
};


