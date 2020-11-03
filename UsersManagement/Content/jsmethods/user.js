﻿//variables
var forms = null;
var isvalidform = null;
var idTable = "#my-final-table";
var dynatable;
var emailVal = "";
var band = false;

//init
$(document).ready(function () {
    forms = new FormsQuro("show_hide_frame_table", "my-final-table", "frame_table", "form", "frame_form");
    dynatable = $(idTable).dynatable().bind('dynatable:afterUpdate', SetChecked).data('dynatable');
    forms.Init();
    forms.HideForm();
    forms.ShowForm(true);//Enable
    //forms.DeleteRowArray(forms.WebApiUrl + "Concept/DeleteConcept", List);
    ValidateForm();
    band = false;

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
    $("#form").validate({
        rules: {
            "Nombre": {
                required: true,
                minlength: 2,
                maxlength: 100
            }
        },
        messages: {
            "Nombre": {
                required: "Indique su nombre",
                minlength: "La longitud del nombre debe contener al menos 2 caracteres",
                maxlength: "La longitud del nombre no debe exceder los 100 carácteres"
            }
        },
        errorClass: "errorwarning",
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

        if ($('#save').hasClass('btn-warning')) {
            operation = "save_modify";
            forms.ExecuteAjax(forms.WebApiUrl + "Concept/UpdateConcept", List, values);
        }
        else {
            values["ConceptoId"] = '';
            forms.ExecuteAjax(forms.WebApiUrl + "Concept/AddConcept", List, values);
        }
    }
}

//llenado de dropdown
function DropList() {
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        data: "",
        beforeSend: function () {
            $.spin('true');
        },
        url: '/Users/GetList',
        success: function (data) {
            if (data != null) {
                //llenado de la tabla
            }
        },
        error: function (xhr) {
            forms.generateNotification('Imposible consumir WS, verifique su conexión-->' + xhr.responseText, "error");
        }
    }).always(function () {
        $.spin('false');
    });
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

function SetChecked() {
    $(idTable + " input").prop("checked", false);
    forms.VisibleButtonsOperations();
    forms.ResetControls();
    forms.ChangeTextButtonChekAll(false, "#checkall");
}