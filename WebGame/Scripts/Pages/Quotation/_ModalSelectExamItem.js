function ModalSelectExamItem(container) {
    var _container = container;
    var _height = 320;
    var _this = this;
    var _selectedItems = [];

    function openContainer() {
        _container.modal('show');
    }
    function closeContainer() {
        _container.modal('hide');
    }

    function setSelectedGroupConfirm() {
        var item = _this.ModalEditGroup.getItem();
        if (!item.ExamItems) {
            $("#jsgrid_SelectedGroup", _container).jsGrid('insertItem', item);
        }

        $("#jsgrid_SelectedGroup", _container).jsGrid('refresh');
        _this.ModalEditGroup.close();
    }

    function findSelectedIds() {
        var selectedIds = [];
        var groups = $("#jsgrid_SelectedGroup", _container).jsGrid('option', 'data');

        if (Array.isArray(groups)) {
            for (var i = 0; i < groups.length; i++) {
                for (var j = 0; j < groups[i].ExamItems.length; j++) {
                    selectedIds.push(groups[i].ExamItems[j].Id);
                }
            }

            _selectedItems = selectedIds;
        }
    }

    function realoadExamTypes() {
        findSelectedIds();
        $("#jsgrid_AllExamItem", _container).jsGrid('loadData');
    }

    this.ModalEditGroup = new ModalSelectedGroup($("#modalEditGroup_SelfPayInfo_A"));
    this.ModalEditGroup.setConfirm(setSelectedGroupConfirm);


    var init = (function () {
        $("#jsgrid_AllExamItem", _container).jsGrid({
            width: "100%",
            height: _height,
            autoload: true,
            pageLoading: true,
            paging: false,
            filtering: true,
            data: [],
            onDataLoading: findSelectedIds,
            controller: {
                loadData: function (filter) {
                    return jsGridTemplate.loadData(filter, {
                        url: '@Url.Action("Ajax_QueryExamItem", "Basic")',
                        param: {
                            NameChi: filter.NameChi,
                            NameEng: filter.NameEng,
                            Price: filter.Price,
                            NotInclude: _selectedItems,
                        },
                        isPaging: false,
                    });
                },
            },
            fields: [
                {
                    name: "Id",
                    itemTemplate: jsGridTemplate.customCheckbox,
                    headerTemplate: jsGridTemplate.customHeaderCheckbox,
                    width: 10, align: "center"
                },
                { name: "NameChi", title: '中文名稱', type: "text", width: 50, align: "left" },
                { name: "NameEng", title: '英文名稱', type: "text", width: 70, align: "left" },
                { name: "Price", title: '價格', type: "text", width: 20, align: "right", filtering: false, },
            ]
        });

        $("#jsgrid_SelectedGroup", _container).jsGrid({
            width: "100%",
            height: _height,
            editing: false,
            data: [],
            rowClick: function (args) {
                $("#jsgrid_SelectedItem", _container).jsGrid('option', 'data', args.item.ExamItems);
            },
            onItemInserted: function (args) {
                var examItems = [];
                args.item.ExamItems = examItems;
            },
            onItemDeleted: function (args) {
                var removedItemIds = args.item.ExamItems.ItemsToIds();
                $("#jsgrid_SelectedItem", _container).jsGrid('option', 'data', []);
                realoadExamTypes();
            },
            fields: [
                { name: "Name", title: '群組', type: "text", width: 100, align: "left" },
                jsGridTemplate.customeEditControl(_this.ModalEditGroup.open),
            ]
        });

        $("#jsgrid_SelectedItem", _container).jsGrid({
            width: "100%",
            height: _height,
            data: [],
            fields: [
                {
                    name: "Id",
                    itemTemplate: jsGridTemplate.customCheckbox,
                    headerTemplate: jsGridTemplate.customHeaderCheckbox
                    , width: 10, align: "center"
                },
                { name: "NameChi", title: '項目', type: "text", width: 50, align: "left" },
                { name: "Price", title: '價格', type: "text", width: 20, align: "right" },
                {
                    type: "control", width: 10, editButton: false, align: "center",
                    headerTemplate: jsGridTemplate.customHeaderDelete
                }
            ],
            onItemDeleted: function (args) {
                var removedItemIds = args.item.Id;
                var group = $("#jsgrid_SelectedGroup", _container);
                realoadExamTypes();
            },
            gearing: $("#jsgrid_AllExamItem", _container),
        });

        $('#btnAddItem', _container).on('click', function (e) {
            var sourceGrid = $("#jsgrid_AllExamItem", _container);
            var targetGrid = $("#jsgrid_SelectedItem", _container);
            var group = $("#jsgrid_SelectedGroup", _container);

            if ($.isEmptyObject(sourceGrid.jsGrid('getSelectedItem'))
                && $.isEmptyObject(group.jsGrid('getSelectedItem'))
            ) { return; }

            if (!$.isEmptyObject(group.jsGrid('getSelectedItem'))) {
                var pushingItem = {};
                var pushingId = {};
                var group = group.jsGrid('getSelectedItem');

                if (sourceGrid.jsGrid('getCheckedValues').length > 0) {
                    pushingId = sourceGrid.jsGrid('getCheckedValues');
                    pushingItem = sourceGrid.jsGrid('getCheckedItems');
                } else if (!$.isEmptyObject(sourceGrid.jsGrid('getSelectedItem'))) {
                    pushingItem = sourceGrid.jsGrid('getSelectedItem');
                    pushingId = pushingItem.Id;
                }
                group.IsEdit = true;
                targetGrid.jsGrid('push', pushingItem);
                realoadExamTypes();
            }
        });

        $('#btnConfirm', _container).on('click', confirm);

        $('#btnCancel', _container).on('click', function (e) {
            closeContainer();
        });

    })();

    function _confirm() { }

    function confirm() {
        // var rtn = _container.validate().form();
        var rtn = true;
        if (rtn) {
            _confirm();
        }
    }

    function setConfirm(e) {
        if (typeof e === "function") {
            _confirm = e;
        }
    }

    return {
        open: openContainer,
        close: closeContainer,
        setConfirm: setConfirm,
    };


}