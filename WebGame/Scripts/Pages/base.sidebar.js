base.sidebar = (function () {
    $("#sidebar").BootSideMenu({
        side: "left",
        theme: 'customtheme'
    });

    if (base.conf.activeMenu.Menu) {
        base.conf.activeMenu.Menu.click();
        base.conf.activeMenu.Menu.addClass('action');
    }
    if (base.conf.activeMenu.Submenu) {
        base.conf.activeMenu.Submenu.addClass('action');
    }
})();