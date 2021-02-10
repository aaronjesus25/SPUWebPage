
var Utils = function (idTable, idDivTable) {

    var self = this;

    self.operation = 'create';
    self.SelectedValues = [];
    self.isvisibleForm = false;
    self.IsvisibleTable = true;
    self.selectall = false;
    self.selectedMultipleValues = null;
    self.deselectedMultipleValues = null;
    self.my_select_groups = "#my-select-groups";
    self.idTable = idTable !== "undefined" && idTable.indexOf("#") === 0 ? idTable : "#" + idTable;
    self.idDivTable = idDivTable !== "undefined" && idDivTable.indexOf("#") === 0 ? idDivTable : "#" + idDivTable;


    /**
    * Inicializador de propiedades
    *
    */
    self.Init = function () {
        self.InitSpinner();
        self.ButtonCheckAll();
        self.getSelectedValues();
    };

    /**
     * Funcion que inicializa el spinner, para dar un efecto de espera cuando se hace uso de ajax     
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
    * Activa o desactiva los botones del formulario dependiendo de la cantidad de registros seleccionados.
    * Un registro se habilita modificar y eliminar, mas de un registro solo habilita el botón eliminar.
    * @param {Array} values - Los valores seleccionados de la tabla. Arreglo de objetos 
    * @returns {} 
    */
    self.ActiveButtons = function (values) {
        var amount = values.length;
        if (amount > 0) {
           
            $('#delete').removeClass('disabled');

            if (amount > 1) {
                $('#create_modify').addClass('disabled');
                $('#checkall').removeClass('disabled');

                self.VisibleButtonsOperations(true);

            } else if (amount === 1) {
                self.VisibleButtonsOperations(true);
            }
        } else {
            self.VisibleButtonsOperations(false);
        }
    };

    self.VisibleButtonsOperations = function (isVisible) {
        if (isVisible) {
            $("#delete").show(1000);
            $("#create").show(1000);
        } else {
            $("#delete").hide(1000);
            $("#create").hide(1000);
        }
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
     * Función que activa el botón para seleccionar todos los checks de la tabla
     * @param {string} idButtonCheckAll - identificador del boton 
     */
    self.ButtonCheckAll = function (idButtonCheckAll) {
        idButtonCheckAll = idButtonCheckAll || "#checkall";
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
     * 
     * @param {string} endPoint - url 
     * @param {function} callback - función que se ejecuta si la petición tuvo éxito
     * @param {object} values -  objeto formado con los datos del formulario, deben tener los mismos nombres que en el modelo
     * @returns {} 
     */
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
    };

    self.AjaxExcel = function (endPoint, nombre, values) {
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
        request.onload = function (e) {
            if (this.status === 200) {
                var blob = this.response;
                if (window.navigator.msSaveOrOpenBlob) {
                    window.navigator.msSaveBlob(blob, fileName);
                }
                else {
                    var downloadLink = window.document.createElement('a');
                    var contentTypeHeader = request.getResponseHeader("Content-Type");
                    downloadLink.href = window.URL.createObjectURL(new Blob([blob], { type: contentTypeHeader }));
                    downloadLink.download = nombre + ".xlsx";
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                }
            }
        };
        request.send(values);
    };

    /**
   * 
   * @param {string} endPoint - url 
   * @param {function} callback - función que se ejecuta si la petición tuvo éxito y debe refrescar la tabla
   * @param {object} values -  objeto formado con los datos del formulario, deben tener los mismos nombres que en el modelo
   * @returns {} 
   */

    self.FillCombo = function (comboId, displayName, dataValue, endPoint, values, method = 'GET') {
        //peticion
        $.ajax({
            type: method,
            contentType: 'application/json',
            data: values,
            beforeSend: function () {
                $.spin('true');
            },
            url: endPoint,
            async: false,
            success: function (data) {

                //valida la respuesta
                if (data.Data !== null) {

                    //obtiene el combobox
                    mySelect = $('#' + comboId);

                    //limpia el elemento
                    $('#' + comboId + " option").remove();

                    //inserta el dato por default
                    mySelect.append($('<option>', {
                        value: 0,
                        text: "Selecciona una opcion..."
                    }));

                    //seta los departamentos
                    $.each(data.Data, function (i, item) {
                        mySelect.append($('<option>', {
                            value: item[dataValue],
                            text: item[displayName]
                        }));
                    });
                }
                else {
                    //obtiene el combobox
                    mySelect = $('#' + comboId);

                    //limpia el elemento
                    $('#' + comboId + " option").remove();

                    //inserta el dato por default
                    mySelect.append($('<option>', {
                        value: 0,
                        text: "Selecciona una opcion..."
                    }));
                }
            },
            error: function (xhr) {
                self.generateNotification('No se ha podido obtener los datos de la geocerca, verifique su conexión-->' + xhr.responseText, "error");
            }
        }).always(function () {
            $.spin('false');
        });
    };
}
