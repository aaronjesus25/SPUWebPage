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
    forms.ShowForm(true);//Enable
    //forms.DeleteRowArray("/Users/Delete", List);
    $('#save').click(function (e) {
        e.preventDefault();
        isvalidform = true;
        Save();
    });

    band = false;

    QuestionsSet();
    FillAutorize();
    FillCopy();
    FillConcepts();
    //List();
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

    $("#form").validate({
        rules: {
            "Name": {
                required: true,
                minlength: 2,
                maxlength: 100
            },
            "Nick": {
                required: true,
                minlength: 8,
                maxlength: 20
            }
        },
        messages: {
            "Name": {
                required: "Indique su nombre",
                minlength: "La longitud del nombre debe contener al menos 2 caracteres",
                maxlength: "La longitud del nombre no debe exceder los 100 carácteres"
            },
            "Nick": {
                required: "Indique su usuario",
                minlength: "La longitud del nombre debe contener al menos 8 caracteres",
                maxlength: "La longitud del nombre no debe exceder los 20 carácteres"
            }
        },
        errorClass: "error",
        errorElement: "span",
        submitHandler: function () {
            isvalidform = $("#form").valid();
            Save();
        }
    });
}

//guardar informacion
function Save() {
    if (isvalidform) {
        var operation = "save";
        var values = forms.getInputsFormValues();
        var questions = [];


        for (var i = 0; i <= counter; i++) {
           
            var question = i === 0 ? $("input[name='name']").val() : $("input[name='name" + (i -1) + "']" ).val();

            var isValid = ValidateQuestion(question);

            if (isValid) {
                paramQuestion = {
                    Text: question
                }

                questions.push(paramQuestion);
            }
        }

        values.Questions = questions;
        console.log(values);

        //if ($('#save').hasClass('btn-warning')) {
        //    operation = "save_modify";
        //    forms.ExecuteAjax("/Requests/Update", List, values);
        //}
        //else {
        //    values["UserId"] = '';
        //    forms.ExecuteAjax("/Requests/SignIn", List, values);
        //}
    }
}

//GET LIST 
function List() {
    $.ajax({
        type: 'GET',
        async: true,
        url: '/Users/GetList',
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
            var newRow = $("<tr>");
            var cols = "";

            cols += '<td><input type="text" class="form-control" name="name' + counter + '"/></td>';
            cols += '<td><input type="button" class="ibtnDel btn btn-md btn-danger "  value="Delete"></td>';

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

/*Llenar drop departamentos*/
function FillAutorize() {

    //llena el combo de datos
    forms.FillCombo("AutorizadorId", 'Name', 'UserId', '/Users/GetListAuthorize', '');
}

/*Llenar drop usuarios de tipo copia*/
function FillCopy() {

    //llena el combo de datos
    forms.FillCombo("CopiaId", 'Name', 'UserId', '/Users/GetListCopy', '');
}

/*Llenar drop usuarios de tipo copia*/
function FillConcepts() {

    //llena el combo de datos
    forms.FillCombo("ConceptId", 'Nombre', 'ConceptId', '/Concepts/GetList', '');
}

function ValidateQuestion(text) {
    if (text === undefined || text === '' || text === null) {
        return false;
    }
    else {
        return true;
    }
}
