function checkTen() {
    var mark = document.getElementById("mark");
    var modifier = document.getElementById("modifier");
    modifier.disabled = false;
    modifier.value = "0";
    if (mark.value == "10") {
        modifier.disabled = true;
    }
}