function checkTen() {
    var mark = document.getElementById("mark");
    var modifier = document.getElementById("modifier");
    modifier.disabled = false;
    modifier.value = "0";
    if (mark.value == "10") {
        modifier.disabled = true;
    }
}

function checkMark() {
    var mark_btn = document.getElementById("insert_mark");
    var mark_desc_text = document.getElementById("mark_desc").value;
    var mark_sub_text = document.getElementById("mark_sub").value;
    var ok_mark_desc = true;
    var ok_mark_sub = true;
    mark_btn.disabled = true;
    if (mark_desc_text.replace(/ /g, '').replace(/(?:\r\n|\r|\n)/g, '') == '') {
        ok_mark_desc = false;
    }
    if (mark_sub_text.replace(/ /g, '').replace(/(?:\r\n|\r|\n)/g, '') == '') {
        ok_mark_sub = false;
    }
    if (ok_mark_desc && ok_mark_sub) {
        mark_btn.disabled = false;
    }
}

function checkNote() {
    var note_btn = document.getElementById("insert_note");
    var note_desc_text = document.getElementById("note_desc").value;
    note_btn.disabled = false;
    if (note_desc_text.replace(/ /g, '').replace(/(?:\r\n|\r|\n)/g, '') == '') {
        note_btn.disabled = true;
    }
}