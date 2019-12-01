var sidebarVisible = false;
function onMenuButtonClick() {
    if (sidebarVisible) {
        document.getElementById("sidebar").style.marginLeft = "-100%";
        sidebarVisible = false;
    }
    else {
        document.getElementById("sidebar").style.marginLeft = "0px";
        sidebarVisible = true;
    }
}