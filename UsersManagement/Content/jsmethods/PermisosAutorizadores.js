//variables
var forms = null;
var isvalidform = null;
var idTable = "#my-final-table";
var dynatable;
var emailVal = "";
var band = false;

//init
$(document).ready(function () {
    forms = new Forms("show_hide_frame_table", "my-final-table", "frame_table", "form", "frame_form");
    dynatable = $(idTable).dynatable().bind('dynatable:afterUpdate', SetChecked).data('dynatable');
    forms.Init();
    forms.HideForm();
    forms.ShowForm(true);//Enable
    forms.DeleteRowArray("/Users/Delete", List);
    $('#save').click(function (e) {
        e.preventDefault();
        Save();
    });

    band = false;

    FillDepts();
    FillUsers();
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
   
    if ($('#DepartmentId').val() === undefined || $('#DepartmentId').val() === null || $('#DepartmentId').val() === '0') {
        swal('Campo obligatorio', 'Debe seleccionar un departamento');
        return false;
    }
   
    return true;
};

//guardar informacion
function Save() {

    isvalidform = ValidateForm();

    if (isvalidform) {
        var operation = "save";
        var values = forms.getInputsFormValues();

        console.log();

        if ($('#save').hasClass('btn-warning')) {
            operation = "save_modify";
            forms.ExecuteAjax("/Users/Update", List, values);
        }
        else {
            values["UserId"] = '';
            forms.ExecuteAjax("/Users/SignIn", List, values);
        }
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

/*Llenar drop departamentos*/
function FillDepts() {

    //llena el combo de datos
    forms.FillCombo("DepartmentId", 'Nombre', 'DepartmentId', '/Departments/GetList', '', 'GET');
    forms.FillCombo("DepartmentList", 'Nombre', 'DepartmentId', '/Departments/GetList', '', 'GET');
}

/*Llenar drop usuarios*/
function FillUsers() {

    //llena el combo de datos
    forms.FillCombo("UserId", 'Name', 'UserId', '/Users/GetList', '', 'GET');
}