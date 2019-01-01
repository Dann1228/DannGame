base.publicPayInfo = (function (container, args) {
    var _container = container;
    var _args = args;

    var init = (function () {
        var _height = 320, pageSize = 10;
        var _oftenGroupId = 0, _allGroupId = 0, _selectedGroupId = 0;
        var _this = this;

        function realoadExamTypes() {
            $("#jsgrid_OftenSetItem", _container).jsGrid('loadData');
            $("#jsgrid_AllSetItem", _container).jsGrid('loadData');
        }

        function setSelectedGroupConfirm() {
            var item = _this.ModalSelectedGroup.getItem();
            if (!item.ExamItems) {
                $("#jsgrid_SelectedGroupPublic", _container).jsGrid('insertItem', item);
            }
            $("#jsgrid_SelectedGroupPublic", _container).jsGrid('refresh');
            base.showTotalCost($("#jsgrid_SelectedGroupPublic", _container));

            _this.ModalSelectedGroup.close();
        }

        function setMultiGroupConfirm() {
            var item = base.ModalMultiGroup.getExamSet();
            if (item.Idx === undefined) {
                $("#jsgrid_SelectedGroupPublic", _container).jsGrid('insertItem', item);
            }
            else {
                var list = $("#jsgrid_SelectedGroupPublic", _container).jsGrid('option', 'data');
                list[item.Idx] = item;
            }
            $("#jsgrid_SelectedGroupPublic", _container).jsGrid('refresh');
            base.showTotalCost($("#jsgrid_SelectedGroupPublic", _container));
        }

        function openModal(item) {
            if (item === undefined) {
                base.ModalSelectedGroup.open();
            }
            else {
                if (item.IsMultiGroup === true) {
                    item.Idx = $("#jsgrid_SelectedGroupPublic", _container).jsGrid('option', 'data').indexOf(item);
                    base.ModalMultiGroup.setConfirm(setMultiGroupConfirm);
                    base.ModalMultiGroup.open(item, false);
                }
                else {
                    base.ModalSelectedGroup.open(item);
                }
            }
        }

        this.ModalSelectedGroup = new ModalSelectedGroup($("#modalEditGroup_PublicPayInfo", _container));
        this.ModalSelectedGroup.setConfirm(setSelectedGroupConfirm);
        base.ModalMultiGroup.setConfirm(setMultiGroupConfirm);


        $("#jsgrid_OftenSetGroup", _container).jsGrid({
            width: "100%",
            height: _height,
            autoload: true,
            pageSize: pageSize,
            paging: false,
            pageLoading: true,
            data: [],
            rowClick: function (args) {
                _oftenGroupId = args.item.Id;
                $("#jsgrid_OftenSetItem", _container).jsGrid('loadData');
            },
            controller: {
                loadData: function (filter) {
                    return jsGridTemplate.loadData(filter, {
                        url: _args.Url.Ajax_QueryExamItemTypeOften,
                        param: {
                            OwnerId: _args.EmployeeId,
                            NotInclude: _args.SelectedItems,
                        },
                        paging: false,
                    });
                },
            },
            fields: [
                { name: "Name", title: '群組', type: "text", width: 100, align: "left" }
            ]
        });

        $("#jsgrid_OftenSetItem", _container).jsGrid({
            width: "100%",
            height: _height,
            autoload: false,
            pageSize: pageSize,
            paging: false,
            pageLoading: true,
            data: [],
            controller: {
                loadData: function (filter) {
                    return jsGridTemplate.loadData(filter, {
                        url: args.Url.Ajax_QueryExamItemOften,
                        param: {
                            OwnerId: _args.EmployeeId,
                            TypeOftenId: _oftenGroupId,
                            NotInclude: _args.SelectedItems,
                        },
                        paging: false,
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
                { name: "NameChi", title: '項目', type: "text", width: 30, align: "left" },
                {
                    name: "Price", title: '價格', type: "text", width: 20, align: "right",
                    itemTemplate: jsGridTemplate.currency
                },
            ]
        });

        $("#jsgrid_PublicSetGroup", _container).jsGrid({
            width: "100%",
            height: _height,
            autoload: true,
            pageSize: pageSize,
            paging: false,
            pageLoading: true,
            data: [],
            rowClick: function (args) {
                _oftenGroupId = args.item.Id;
                $("#jsgrid_PublicSetItem", _container).jsGrid('loadData');
            },
            controller: {
                loadData: function (filter) {
                    return jsGridTemplate.loadData(filter, {
                        url: _args.Url.Ajax_QueryExamItemTypeOften,
                        param: {
                            OwnerId: 0,
                            NotInclude: _args.SelectedItems,
                        },
                        paging: false,
                    });
                },
            },
            fields: [
                { name: "Name", title: '群組', type: "text", width: 100, align: "left" }
            ]
        });

        $("#jsgrid_PublicSetItem", _container).jsGrid({
            width: "100%",
            height: _height,
            autoload: false,
            pageSize: pageSize,
            paging: false,
            pageLoading: true,
            data: [],
            controller: {
                loadData: function (filter) {
                    return jsGridTemplate.loadData(filter, {
                        url: _args.Url.Ajax_QueryExamItemOften,
                        param: {
                            OwnerId: 0,
                            TypeOftenId: _oftenGroupId,
                            NotInclude: _args.SelectedItems,
                        },
                        paging: false,
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
                { name: "NameChi", title: '項目', type: "text", width: 30, align: "left" },
                {
                    name: "Price", title: '價格', type: "text", width: 20, align: "right",
                    itemTemplate: jsGridTemplate.currency,
                },
            ]
        });

        $("#jsgrid_AllSetItem", _container).jsGrid({
            width: "100%",
            height: _height,
            autoload: true,
            pageSize: pageSize,
            pageLoading: true,
            paging: false,
            filtering: true,
            data: [],
            controller: {
                loadData: function (filter) {
                    return jsGridTemplate.loadData(filter, {
                        url: _args.Url.Ajax_QueryExamItem,
                        param: {
                            NameChi: filter.NameChi,
                            NameEng: filter.NameEng,
                            Price: filter.Price,
                            NotInclude: _args.SelectedItems,
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
                {
                    name: "Price", title: '價格', type: "text", width: 20, align: "right", filtering: false,
                    itemTemplate: jsGridTemplate.currency,
                },
            ]
        });

        $("#jsgrid_SelectedGroupPublic", _container).jsGrid({
            width: "100%",
            height: _height,
            editing: false,
            pageSize: pageSize,
            data: _args.ExamGroups,
            rowClick: function (args) {
                $("#jsgrid_SelectedItem", _container).jsGrid('option', 'data', args.item.ExamItems);
            },
            onItemInserted: function (args) {
                args.item.IsEdit = true;
                args.item.ExamItems = args.item.ExamItems || [];
            },
            onItemUpdated: function (args) {
                args.item.IsEdit = true;
            },
            onItemDeleted: function (args) {
                var removedItemIds = args.item.ExamItems.ItemsToIds();
                _args.SelectedItems.drop(removedItemIds);
                $("#jsgrid_SelectedItem", _container).jsGrid('option', 'data', []);
                realoadExamTypes();
            },
            fields: [
                { name: "Name", title: '群組', type: "text", width: 100, align: "left" },
                jsGridTemplate.customeEditControl(openModal),
            ]
        });

        $("#jsgrid_SelectedItem", _container).jsGrid({
            width: "100%",
            height: _height,
            pageSize: pageSize,
            data: [],
            fields: [
                {
                    name: "Id",
                    itemTemplate: jsGridTemplate.customCheckbox,
                    headerTemplate: jsGridTemplate.customHeaderCheckbox
                    , width: 10, align: "center"
                },
                { name: "NameChi", title: '項目', type: "text", width: 50, align: "left" },
                {
                    name: "Cost", title: '成本', type: "text", width: 20, align: "right",
                    itemTemplate: jsGridTemplate.currency
                },
                { type: "control", width: 10, editButton: false }
            ],
            onItemDeleted: function (args) {
                var removedItemIds = args.item.Id;
                var group = $("#jsgrid_SelectedGroupPublic", _container);
                _args.SelectedItems.splice(_args.SelectedItems.indexOf(removedItemIds.toString()), 1);
                group.IsEdit = true;
            },
        });

        $(".jsgrid-grid-body", _container)
            .css("overflow-x", 'auto')
            .css("overflow-y", 'scroll');


        $('#btnAddGroup', _container).on('click', function (e) {
            if ($("#divOftenSet").is(':visible') || $("#divPublicSet").is(':visible')) {
                var section = $("#divOftenSet").is(':visible') ? 'Often' : 'Public';
                var dataGroup = $("#jsgrid_" + section + "SetGroup", _container).jsGrid('getSelectedItem');
                var originGroups = $("#jsgrid_SelectedGroupPublic", _container).jsGrid('option', 'data');
                var dataItems = $("#jsgrid_" + section + "SetItem", _container).jsGrid('option', 'data');

                if (!$.isEmptyObject(dataGroup)) {
                    dataGroup.IsEdit = false;
                    dataGroup.ExamItems = dataItems;
                    originGroups.push(dataGroup);
                    $("#jsgrid_SelectedGroupPublic", _container).jsGrid('option', 'data', originGroups);
                    $("#jsgrid_SelectedItem", _container).jsGrid('option', 'data', dataItems);

                    _args.SelectedItems = _args.SelectedItems.concat(dataItems.ItemsToIds());
                    realoadExamTypes();
                }
            }
        });

        $('#btnAddItem', _container).on('click', function (e) {
            var sourceGrid = {};
            var targetGrid = $("#jsgrid_SelectedItem", _container);
            var group = $("#jsgrid_SelectedGroupPublic", _container);

            if ($("#divOftenSet", _container).is(':visible')) {
                sourceGrid = $("#jsgrid_OftenSetItem", _container);
            }
            if ($("#divAllSet", _container).is(':visible')) {
                sourceGrid = $("#jsgrid_AllSetItem", _container);
            }
            if ($("#divPublicSet", _container).is(':visible')) {
                sourceGrid = $("#jsgrid_PublicSetItem", _container);
            }

            if ($.isEmptyObject(sourceGrid.jsGrid('getSelectedItem'))
                && $.isEmptyObject(group.jsGrid('getSelectedItem'))
            ) { return; }

            if (!$.isEmptyObject(group.jsGrid('getSelectedItem'))) {
                var pushingItem = {};
                var pushingId = {};
                group = group.jsGrid('getSelectedItem');

                if (sourceGrid.jsGrid('getCheckedValues').length > 0) {
                    pushingId = sourceGrid.jsGrid('getCheckedValues');
                    pushingItem = sourceGrid.jsGrid('getCheckedItems');
                } else if (!$.isEmptyObject(sourceGrid.jsGrid('getSelectedItem'))) {
                    pushingItem = sourceGrid.jsGrid('getSelectedItem');
                    pushingId = pushingItem.Id;
                }
                group.IsEdit = true;
                targetGrid.jsGrid('push', pushingItem);
                _args.SelectedItems = _args.SelectedItems.concat(pushingId);
                realoadExamTypes();
            }
        });

        $('#btnMultiGroup', _container).on('click', function (e) {
            base.ModalMultiGroup.open(undefined, false);
        });

        $(document).ready(function () {
            base.showTotalCost($("#jsgrid_SelectedGroupPublic", _container));
        });

    })();

    return this;
});