function ModalSelectedGroup (container) {
    var _container = container;
    var _item = {};
    var $_GroupName = $("#txtGroupName", _container);
    var $_GroupDesc = $("#txtGroupDesc", _container);

    function openContainer(item) {
        if (item !== undefined) {
            setItem(item);
        }
        else {
            clear();
        }

        _container.modal('show');
    }

    function getItem() {
        var rtn = _item;
        rtn.Name = $_GroupName.val();
        rtn.Description = $_GroupDesc.val();
        return rtn;
    }

    function setItem(item) {
        _item = item;
        $_GroupName.val(_item.Name);
        $_GroupDesc.val(_item.Description);
    }

    function clear() {
        _item = {};
        $_GroupName.val('');
        $_GroupDesc.val('');
    }

    function closeContainer() {
        _container.modal('hide');
    }

    function _confirm() { }

    function confirm() {
        var rtn = _container.validate().form()
        if (rtn) {
            _confirm();
        }
    }

    $("#btnConfirm", _container).on('click', confirm);
    $("#btnCancel", _container).on('click', closeContainer);

    this.open = openContainer;
    this.getItem = getItem;
    this.setItem = setItem;
    this.close = closeContainer;
    this.confirm = confirm;
    this.setConfirm = function (e) {
        if (typeof e === "function") {
            _confirm = e;
        }
    }

}