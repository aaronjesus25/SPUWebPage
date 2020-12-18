
var Utils = function () {

    var self = this;

    /**
    * Inicializador de propiedades
    *
    */
    self.Init = function () {
        self.InitSpinner();
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
}
