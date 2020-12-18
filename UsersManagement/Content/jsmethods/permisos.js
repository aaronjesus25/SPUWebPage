//variables
var forms = null;
var isvalidform = null;
var idTable = "#my-final-table";
var dynatable;
var emailVal = "";
var band = false;
var utils = null;

//init
$(document).ready(function () {
    utils = new Utils();
    utils.Init();

    dynatable = $(idTable).dynatable().data('dynatable');
     
    List();
});

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

    //valida la lista de datos
    if (data !== null && data.Data !== undefined && data.Data !== null) {

        //obtiene la lista 
        var myRecords = data.Data;

        //recorre la lista 
        for (var i = 0; i < myRecords.length; i++) {

            //identificador
            var Id = myRecords[i]["UserId"];

            //valida permisos por cada usuario
            var selectedBoss = myRecords[i]["Boss"] === true ? 'checked' : '';
            var selectedAuth = myRecords[i]["Authorizing"] === true ? 'checked' : '';
            var selectedPetitioner = myRecords[i]["Petitioner"] === true ? 'checked' : '';
            var selectedCopy = myRecords[i]["Copy"] === true ? 'checked' : '';

            //seta los checkboxes a la tabla de permisos
            myRecords[i]["Jefe"] = "<input id='" + Id + "-" + "1' " + " type='checkbox' class='case' name='case[]' onclick='SetPermisionCheck( " + Id + "," + "1" + "," + myRecords[i]["Boss"] + "  );'" + selectedBoss + "/>";
            myRecords[i]["Autorizador"] = "<input id='" + Id + "-" + "2' " + " type='checkbox' class='case' name='case[]' onclick='SetPermisionCheck( " + Id + "," + "2" + "," + myRecords[i]["Authorizing"] + " );'" + selectedAuth + "/>";
            myRecords[i]["Solicitante"] = "<input id='" + Id + "-" + "3' " + " type='checkbox' class='case' name='case[]' onclick='SetPermisionCheck( " + Id + "," + "3" + "," + myRecords[i]["Petitioner"] + " );'" + selectedPetitioner + "/>";
            myRecords[i]["Copia"] = "<input id='" + Id + "-" + "4' " + " type='checkbox' class='case' name='case[]' onclick='SetPermisionCheck( " + Id + "," + "4" + "," + myRecords[i]["Copy"] + " );'" + selectedCopy + "/>";
        }

        //escribe la tabla en el DOM
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

//actualiza los permisos del usuario
function SetPermisionCheck(userId, type) {

    //obtiene la informacion del check seleccionado
    var checkbox = $("#" + userId + "-" + type).is(":checked");

    //valida el status para asignarlo
    if (checkbox) {
        UpdateStats(true, type, userId);
    } else {
        UpdateStats(false, type, userId);
    }
}

//envia la peticion update a la bd
function UpdateStats(bool, type, UserId) {
    debugger;
    //parametros
    values = {
        UserId: UserId
    }

    //setea el tipo de usuario seleccionado
    switch (type) {
        case 1: //Jefe
            values.Boss = bool;
            break

        case 2://Autorizador
            values.Authorizing = bool;
            break

        case 3://solicitante
            values.Petitioner = bool;
            break

        case 4://copia
            values.Copy = bool;
            break
    }   

    //peticion
    utils.ExecuteAjax('/Users/UpdatePermisions', List, values, false);
}
