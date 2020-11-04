//variables
var idTable = "#my-final-table";
var dynatable;


//init
$(document).ready(function () {
    forms = new Forms("", "", "", "", "");
    dynatable = $(idTable).dynatable().data('dynatable');
    forms.InitSpinner();

    $.ajax({
        type: 'GET',
        async: true,
        url: '/Users/GetList',
        beforeSend: function (xhr) {
            $.spin('true');
        }
    }).done(function (data) {

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

    }).fail(function (data) {
        alert("Error", "Ha ocurrido un error intentelo más tarde")
    }).always(function () {
        $.spin('false');
    })
});