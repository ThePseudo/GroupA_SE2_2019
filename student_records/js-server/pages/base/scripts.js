var sidebarVisible = false;
function onMenuButtonClick() {
    if (sidebarVisible) {
        document.getElementById("sidebar").style.marginLeft = "-100%";
        document.getElementById("navtoggle").classList.remove("activeMenuButton");
        sidebarVisible = false;
    }
    else {
        document.getElementById("sidebar").style.marginLeft = "0px";
        document.getElementById("navtoggle").classList.add("activeMenuButton");
        sidebarVisible = true;
    }
}