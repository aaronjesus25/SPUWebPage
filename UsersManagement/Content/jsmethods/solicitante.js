﻿//variables
var forms = null;
var isvalidform = null;
var idTable = "#my-final-table";
var dynatable;
var emailVal = "";
var band = false;
var utils = null;

//init
$(document).ready(function () {
    utils = new Utils("my-final-table", "frame_table");
    utils.Init();

    dynatable = $(idTable).dynatable().data('dynatable');

    InitializeDatePicker();
    ApproveRequest();
    SaveAnswers();
    DenyRequest();
    FillAutorize();
    FillCopy();
    List();
});

//GET LIST 
function List() {

    //parametros
    var data = {
        DateStart: $("#dateTimePickerStart").val(),
        DateEnd: $("#dateTimePickerEnd").val(),
        TypeRequest: $('#Status').val()
    };

    //peticion de busqueda 
    $.ajax({
        type: 'POST',
        async: true,
        data: data,
        url: '/Requests/GetListBoss',
        beforeSend: function (xhr) {
            $.spin('true');
        }
    }).done(function (data) {

        //deshabilita los botones antes de actualizar 
        utils.VisibleButtonsOperations(false);

        //actualiza la tabla de datos 
        BuidList(data);

    }).fail(function (data) {

        swal('Error', data.Message);
    }).always(function (data) {
        $.spin('false');
    })
}

//prepara la tabla para la vista 
function BuidList(data) {

    if (data !== null && data.Data !== undefined && data.Data !== null) {

        var myRecords = data.Data;

        for (var i = 0; i < myRecords.length; i++) {
            myRecords[i]["html"] = "<input type='checkbox' class='case' name='case[]' onclick='SelectedCheck();'/>"
            myRecords[i]["btnQuestions"] = "<input type='button' class='btn btn-primary btn-block' value='Preguntas' name='showquestions' id='showquestions' onclick='ShowQuestions( " + myRecords[i]["RequestId"] + " );'/>"
        }

        dynatable.settings.dataset.originalRecords = myRecords;
        dynatable.sorts.clear();
        dynatable.paginationPage.set(1);
        dynatable.process();
        dynatable.dom.update();
    }
    else {
        var myRecords = [];

        dynatable.settings.dataset.originalRecords = myRecords;
        dynatable.sorts.clear();
        dynatable.paginationPage.set(1);
        dynatable.process();
        dynatable.dom.update();
    }
}

//evento seleccionar registro
function SelectedCheck() {
    var checked = $(idTable + " input:checked");
    if (checked.length !== 0) {
        utils.ChangeTextButtonChekAll(true, "#checkall");
    } else {
        utils.ChangeTextButtonChekAll(false, "#checkall");
    }
    utils.getSelectedValues();
}

//evento clic Responder solicitud
function ApproveRequest() {
    $('#create').click(function (e) {

        //evitar post
        e.preventDefault();

        //obtengo los datos seleccionados
        var data = utils.SelectedValues;

        //aplica la configuracion selecionada
        $.each(data, function (key, value) {

            var id = value.RequestId;

            var values = {
                RequestId: id
            }

            //ejecutala peticion para recuperar las preguntas  
            utils.ExecuteAjax("/Requests/GetById", ModalQuestionsResponse, values, false);
        });
    });
}

//arma las preguntas para ser respondidas 
function ModalQuestionsResponse(data) {

    //valida los datos
    if (data !== null && data.Data !== undefined && data.Data !== null) {

        //obtiene las preguntas
        var dataResponse = data.Data;

        //crea la lista 
        var htmlModal = '<ul class="list-group" id="myList">';

        //llena la lista de datos
        for (var i = 0; i < dataResponse.length; i++) {

            //obtiene las preguntas y los identificadores 
            var questionsArray = dataResponse[i]['QuestionsVM'];
            var copia = dataResponse[i]['CopyId'];
            var autorizador = dataResponse[i]['AuthorizeId'];
            var lockC = dataResponse[i]['LockCopy'];
            var lockA = dataResponse[i]['LockAutorize'];

            //setea el usuario copia y autorizador
            $('#CopyId').val(copia);
            $('#AuthorizeId').val(autorizador);

            //bloquea los controles si esta cerrada la solicitud
            if (lockA === 2) {
                $('#AuthorizeId').prop('disabled', true)
            } else {
                $('#AuthorizeId').prop('disabled', false)
            }
            //
            if (lockC === 2) {
                $('#CopyId').prop('disabled', true)
            } else {
                $('#CopyId').prop('disabled', false)
            }

            //recorre las preguntas
            for (var c = 0; c < questionsArray.length; c++) {

                //control para responder la pregunta
                var responseText = '<input type="text" name="answer" data-id="' + questionsArray[c].questionId + '" class="form-control" />';

                //nueva fila
                htmlModal += '<li class="list-group-item"> ' + questionsArray[c].Text + '<br/>' + responseText + ' </li>';
            }
        }

        //cierre de la lista
        htmlModal += '</ul> ';

        //envia los datos 
        $('#contentmodalresp').html(htmlModal);
        $('#myModalResponse').modal('show');
    }
}

//evento clic guaradar las respuestas de la solicitud
function SaveAnswers() {
    $('#save-answers').click(function (e) {
       
        //evitar post
        e.preventDefault();

        //Variables  
        var copiaId = $('#CopyId').val();
        var autorizadorId = $('#AuthorizeId').val();
        var answersArray = [];

        $.each($('#contentmodalresp input'), function () {

            //obtiene la respuesta del campo de texto
            var answer = $(this).val();

            //obtiene el id de la pregunta que se respondió
            var id = $(this).data('id');

            //crea el objeto
            objQuestion = {
                questionId: id,
                Answer: answer
            };

            //guarda el objeto en el arreglo
            answersArray.push(objQuestion);
        });
        
        //obtengo los datos seleccionados
        var data = utils.SelectedValues;

        //guarda la configuracion de la solicitud
        $.each(data, function (key, value) {

            var id = value.RequestId;

            var values = {
                RequestId: id,
                Questions: answersArray,
                CopyId: copiaId,
                AuthorizeId: autorizadorId
            }

            //oculta la ventana modal antes de guardar
            $('#myModalResponse').modal('hide');

            //ejecutala peticion para recuperar las preguntas  
            utils.ExecuteAjax("/Requests/Approve", List, values);
        });
    });
}

//evento clic rechazar solicitud
function DenyRequest() {
    $('#delete').click(function (e) {

        //evitar post
        e.preventDefault();

        //obtengo los datos seleccionados
        var data = utils.SelectedValues;

        //aplica la configuracion selecionada
        $.each(data, function (key, value) {

            var id = value.RequestId;

            var values = {
                RequestId: id
            }

            utils.ExecuteAjax("/Requests/deny", List, values);
        });
    });
}

//muestra las preguntas de la solicitud
function ShowQuestions(reqId) {

    //parametros
    var values = {
        RequestId: reqId
    }

    //ejecutala peticion para recuperar las preguntas  
    utils.ExecuteAjax("/Requests/GetById", ModalQuestions, values, false);
}

//arma la ventana modal de preguntas 
function ModalQuestions(data) {

    //valida los datos
    if (data !== null && data.Data !== undefined && data.Data !== null) {

        //obtiene las preguntas
        var dataResponse = data.Data;

        //crea la  lista 
        var htmlModal = '<ul class="list-group" id="myList">';

        //llena la lista de datos
        for (var i = 0; i < dataResponse.length; i++) {

            var questionsArray = dataResponse[i]['QuestionsVM'];

            for (var c = 0; c < questionsArray.length; c++) {
                htmlModal += '<li class="list-group-item"> ' + questionsArray[c].Text + ' </li>';
            }
        }

        //cierre de la lista
        htmlModal += '</ul> ';

        //envia los datos 
        $('#contentmodal').html(htmlModal);
        $('#myModal').modal('show');
    }
}

//init datetimes
function InitializeDatePicker() {
    $datepicker = $('#dateTimePickerStart');
    $dateEnd = $('#dateTimePickerEnd');
    $datepicker.daterangepicker({
        timePicker: true,
        autoUpdateInput: false,
        singleDatePicker: true,
        locale: {
            format: 'DD/MM/YYYY h:mm A'
        }
    });
    $dateEnd.daterangepicker({
        timePicker: true,
        singleDatePicker: true,
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY h:mm A'
        }
    });
    var dt = new Date();
    var start = dt.getDate() + '/' + ((dt.getMonth() + 1) <= 9 ? '0' + (dt.getMonth() + 1) : (dt.getMonth() + 1)) + '/' + dt.getFullYear() + ' 12:00 AM';
    $datepicker.val(start);
    $datepicker.data('daterangepicker').setStartDate(start);
    var end = dt.getDate() + '/' + ((dt.getMonth() + 1) <= 9 ? '0' + (dt.getMonth() + 1) : (dt.getMonth() + 1)) + '/' + dt.getFullYear() + ' 11:59 PM';
    $dateEnd.val(end);
    $dateEnd.data('daterangepicker').setStartDate(end);
    //
    $datepicker.on('hide.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY h:mm A'));
    });
    $datepicker.on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY h:mm A'));
    });
    //
    $dateEnd.on('hide.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY h:mm A'));
    });
    $dateEnd.on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY h:mm A'));
    });
}

/*Llenar drop usuarios de tipo autorizador*/
function FillAutorize() {

    //llena el combo de datos
    utils.FillCombo("AuthorizeId", 'Name', 'UserId', '/Users/GetListAuthorize', '');
}

/*Llenar drop usuarios de tipo copia*/
function FillCopy() {

    //llena el combo de datos
    utils.FillCombo("CopyId", 'Name', 'UserId', '/Users/GetListCopy', '');
}