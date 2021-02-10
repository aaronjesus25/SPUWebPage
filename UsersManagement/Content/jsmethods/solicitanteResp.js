//variables
var forms = null;
var isvalidform = null;
var idTable = "#my-final-table";
var dynatable;
var emailVal = "";
var band = false;
var counter = 0;

//init
$(document).ready(function () {
    forms = new Forms("show_hide_frame_table", "my-final-table", "frame_table", "form", "frame_form");
    dynatable = $(idTable).dynatable().bind('dynatable:afterUpdate', SetChecked).data('dynatable');
    forms.Init();
    forms.HideForm();
    forms.ShowForm(RequestUpdate);//Enable
    forms.DeleteRowArray("/Requests/Delete", List);
    $('#save').click(function (e) {
        e.preventDefault();
        Save();
    });

    band = false;

    InitializeDatePicker()
    QuestionsSet();
    FillAutorize();
    FillCopy();
    FillConcepts();
    List();
});

//evento seleccionar registro
function SelectedCheck() {
    var checked = $(idTable + " input:checked");
    if (checked.length !== 0) {
        forms.ChangeTextButtonChekAll(true, "#checkall");
    } else {
        forms.ChangeTextButtonChekAll(false, "#checkall");
    }
    forms.getSelectedValues();
}

//validar formulario
function ValidateForm() {

    if ($('#ConceptId').val() === undefined || $('#ConceptId').val() === null || $('#ConceptId').val() === '0') {
        swal('Campo obligatorio', 'Debe seleccionar un concepto');
        return false;
    }

    if ($('#AuthorizeId').val() === undefined || $('#AuthorizeId').val() === null || $('#AuthorizeId').val() === '0') {
        swal('Campo obligatorio', 'Debe seleccionar un Autorizador');
        return false;
    }

    if ($('#CopyId').val() === undefined || $('#CopyId').val() === null || $('#CopyId').val() === '0') {
        swal('Campo obligatorio', 'Debe seleccionar una copia');
        return false;
    }

    if ($("input[name='name']").val() === undefined || $("input[name='name']").val() === null || $("input[name='name']").val() === '') {
        swal('Campo obligatorio', 'Debe escribir una pregunta');
        return false;
    }

    return true;
}

//guardar informacion
function Save() {

    //valida los datos del formmulario
    isvalidform = ValidateForm();

    //si los datos son validos
    if (isvalidform) {

        //variables locales
        var operation = "save";
        var values = forms.getInputsFormValues();
        var questions = [];

        //recorre las peticiones del solicitante
        for (var i = 0; i <= counter; i++) {

            //obtiene la solicitud
            var question = i === 0 ? $("input[name='name']").val() : $("input[name='name" + (i - 1) + "']").val();

            //valida informacion
            var isValid = ValidateQuestion(question);

            //si es valido guarda la info
            if (isValid) {
                paramQuestion = {
                    Text: question
                }

                questions.push(paramQuestion);
            }
        }

        values.Questions = questions;

        if ($('#save').hasClass('btn-warning')) {
            operation = "save_modify";

            console.log(values);
            forms.ExecuteAjax("/Requests/Update", List, values);
        }
        else {
            values["RequestId"] = '';
            forms.ExecuteAjax("/Requests/Create", List, values);
        }
    }
}

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
        url: '/Requests/GetListPetitioner',
        beforeSend: function (xhr) {
            $.spin('true');
        }
    }).done(function (data) {

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

//deseleccionar registros
function SetChecked() {
    $(idTable + " input").prop("checked", false);
    forms.VisibleButtonsOperations();
    forms.ResetControls();
    forms.ChangeTextButtonChekAll(false, "#checkall");
}

//tabla de preguntas para solicitudes
function QuestionsSet() {

    //evento boton nueva pregunta
    $("#addrow").on("click", function () {

        //valida que solo se registren 5 preguntas
        if (counter <= 3) {
            var newRow = $("<tr class='autogenerate'>");
            var cols = "";

            cols += '<td><input type="text" class="form-control" name="name' + counter + '"/></td>';
            cols += '<td><input type="button" class="ibtnDel btn btn-md btn-danger "  value="Eliminar"></td>';

            newRow.append(cols);

            $("table.order-list").append(newRow);

            counter++;
        }
    });

    //evento boton eliminar pregunta 
    $("table.order-list").on("click", ".ibtnDel", function (event) {
        $(this).closest("tr").remove();
        counter -= 1
    });
}

//prepara la solicitud para ser editada
function RequestUpdate() {

    //si no hay datos seleccionados limpia y sale 
    if (forms.SelectedValues.length === 0) {
        resetQuestions();
        return false;
    }

    //obtiene el id de la solicitud seleccionada
    var reqId = forms.SelectedValues[0]['RequestId']

    //parametros
    var values = {
        RequestId: reqId
    }

    //ejecutala peticion para recuperar las preguntas  
    forms.ExecuteAjax("/Requests/GetById", QuestionsUpdate, values, false);
}

//tabla de preguntas para solicitudes
function QuestionsUpdate(request) {

    //valida los datos
    if (request !== null && request.Data !== undefined && request.Data !== null) {

        //reseta el contenedor de las preguntas 
        resetQuestions();

        //obtiene la solicitud
        var dataResponse = request.Data;

        //varifica datos de la solicitud
        for (var i = 0; i < dataResponse.length; i++) {

            //obtengo las preguntas 
            var questionsArray = dataResponse[i]['QuestionsVM'];

            //contador de preguntas 
            counter = questionsArray.length;

            //llena la lista de datos
            for (var i = 0; i < counter; i++) {

                if (i === 0) {
                    $('input[name ="name"]').val(questionsArray[i]['Text']);
                }
                else {
                    var newRow = $("<tr class='autogenerate'>");
                    var cols = "";

                    cols += '<td><input type="text" class="form-control" name="name' + i + '" value="' + questionsArray[i]['Text'] + '" /></td>';
                    cols += '<td><input type="button" class="ibtnDel btn btn-md btn-danger " value="Eliminar"></td>';

                    newRow.append(cols);

                    $("table.order-list").append(newRow);
                }
            }
        }
    }
}

//resetea la tabla de preguntas 
function resetQuestions() {
    $('.autogenerate').remove();
    counter = 0;
}

/*Llenar drop departamentos*/
function FillAutorize() {

    //llena el combo de datos
    forms.FillCombo("AuthorizeId", 'Name', 'UserId', '/Users/GetListAuthorize', '');
}

/*Llenar drop usuarios de tipo copia*/
function FillCopy() {

    //llena el combo de datos
    forms.FillCombo("CopyId", 'Name', 'UserId', '/Users/GetListCopy', '');
}

/*Llenar drop de conceptos*/
function FillConcepts() {

    //llena el combo de datos
    forms.FillCombo("ConceptId", 'Nombre', 'ConceptId', '/Concepts/GetList', '');
}

//valida la pregunta
function ValidateQuestion(text) {
    if (text === undefined || text === '' || text === null) {
        return false;
    }
    else {
        return true;
    }
}

//muestra las preguntas de la solicitud
function ShowQuestions(reqId) {

    //parametros
    var values = {
        RequestId: reqId
    }

    //ejecutala peticion para recuperar las preguntas  
    forms.ExecuteAjax("/Requests/GetById", ModalQuestions, values, false);
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