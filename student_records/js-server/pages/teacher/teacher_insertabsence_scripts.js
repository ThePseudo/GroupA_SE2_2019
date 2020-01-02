// State can be Absent, LateEntry or EarlyExit

function insertAbsence(e) {
    insert(e, "Absent");
}

function insertLateEntry(e) {
    insert(e, "LateEntry");
}

function insertEarlyExit(e) {
    insert(e, "EarlyExit");
}

function insert(e, absType) {
    $.ajax({
        type: "POST",
        url: "./student/" + e.id + "/insert_absence",
        data:
        {
            type: absType
        },
        success: function (response) {
            loadPage();
            console.log(response);
        }
    });
}

function removeAbsence(e) {
    $.ajax({
        type: "POST",
        url: "./student/" + e.id + "/remove_absence",
        success: function (response) {
            loadPage();
            console.log(response);
        }
    });
}

$(document).ready(() => {
    loadPage();
})

function loadPage() {
    $.ajax({
        type: "GET",
        url: "./absence_table",
        success: function (response) {
            $("#content").html(response);
        }
    });
}