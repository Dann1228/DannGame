base.selfPayInfo = (function (container, args) {
    var _container = container;
    var _args = args;
    var _height = 180;

    function setExamSetIntoModal(jsGrid_ExamSet) {
        base.ModalSelectExamItem.setExamSet($(jsGrid_ExamSet).jsGrid('option', 'data'));
    }

    var init = (function () {
        function setSelectItem(jsGrid) {
            base.ModalSelectExamItem.setConfirm(function () {
                var data = base.ModalSelectExamItem.getExamSet();
                var multiSelectGroup = $.grep(jsGrid.jsGrid('option', 'data'), function (item, index) {
                    return item.IsMultiGroup === true;
                });
                data = data.concat(multiSelectGroup);
                jsGrid.jsGrid('option', 'data', data);
                jsGrid.jsGrid('refresh');
                base.showTotalCost(jsGrid);
                base.ModalSelectExamItem.close();
            });

            var group = $.grep(jsGrid.jsGrid('option', 'data'), function (item, index) {
                return item.IsMultiGroup === undefined || item.IsMultiGroup === false;
            })
            base.ModalSelectExamItem.open(group);
        }

        function setSelectItemWithoutGroup(jsGrid) {
            base.ModalSelectExamItemWithoutGroup.setConfirm(function () {
                var data = base.ModalSelectExamItemWithoutGroup.getExamSet();
                var group = jsGrid.jsGrid('option', 'data')[0];
                group.ExamItems = data;
                jsGrid.jsGrid('refresh');
                base.ModalSelectExamItemWithoutGroup.close();
            });

            var group = $.grep(jsGrid.jsGrid('option', 'data'), function (item, index) {
                return item.IsMultiGroup === undefined || item.IsMultiGroup === false;
            })
            base.ModalSelectExamItemWithoutGroup.open(group[0]);
        }

        function setMultiSelectGroupItem(jsGrid, item) {
            base.ModalMultiGroup.setConfirm(function () {
                var data = base.ModalMultiGroup.getExamSet();
                if (data.Idx === undefined) {
                    jsGrid.jsGrid('insertItem', data);
                } else {
                    var list = jsGrid.jsGrid('option', 'data');
                    list[data.Idx] = data;
                }
                jsGrid.jsGrid('refresh');
                base.ModalMultiGroup.close();
            });
            base.ModalMultiGroup.open(item);
        }

        function openModal(jsGrid, withoutGroup) {
            var selected = jsGrid.jsGrid('getSelectedItem');
            if (selected !== undefined && !$.isEmptyObject(selected) && selected.IsMultiGroup === true) {
                setMultiSelectGroupItem(jsGrid, selected);
            }
            else {
                if (withoutGroup) {
                    setSelectItemWithoutGroup(jsGrid);
                }
                else {
                    setSelectItem(jsGrid);
                }
            }
        }

        $("#btnSelectItemsA", _container).on('click', function (e) {
            openModal($("#jsgrid_SelectedGroupA", _container));
        });
        $("#btnSelectItemsB", _container).on('click', function (e) {
            openModal($("#jsgrid_SelectedGroupB", _container));
        });
        $("#btnSelectItemsC", _container).on('click', function (e) {
            openModal($("#jsgrid_SelectedGroupC", _container));
        });
        $("#btnSelectItemsD", _container).on('click', function (e) {
            openModal($("#jsgrid_SelectedGroupD", _container));
        });
        $("#btnSelectItemsE", _container).on('click', function (e) {
            openModal($("#jsgrid_SelectedGroupE", _container), true);
        });
        $("#btnSelectItemsBonus", _container).on('click', function (e) {
            setSelectItem($("#jsgrid_SelectedGroupBonus", _container));
        });

        $("#btnMultiGroupA", _container).on('click', function (e) {
            setMultiSelectGroupItem($("#jsgrid_SelectedGroupA", _container));
        });
        $("#btnMultiGroupB", _container).on('click', function (e) {
            setMultiSelectGroupItem($("#jsgrid_SelectedGroupB", _container));
        });
        $("#btnMultiGroupC", _container).on('click', function (e) {
            setMultiSelectGroupItem($("#jsgrid_SelectedGroupC", _container));
        });
        $("#btnMultiGroupD", _container).on('click', function (e) {
            setMultiSelectGroupItem($("#jsgrid_SelectedGroupD", _container));
        });
        $("#btnMultiGroupE", _container).on('click', function (e) {
            setMultiSelectGroupItem($("#jsgrid_SelectedGroupE", _container));
        });


        $("#jsgrid_SelectedGroupA", _container).jsGrid({
            width: "100%",
            height: _height,
            data: _args.GroupA,
            rowClick: function (args) {
                $("#jsgrid_SelectedItemA", _container).jsGrid('option', 'data', args.item.ExamItems);
            },
            onItemDeleted: function (args) {
                $("#jsgrid_SelectedItemA", _container).jsGrid('option', 'data', []);
            },
            fields: [
                { name: "Name", title: '群組', type: "text", width: 100, align: "left" },
                { type: "control", width: 10, editButton: false },
            ]
        });

        $("#jsgrid_SelectedItemA", _container).jsGrid({
            width: "100%",
            height: _height,
            data: [],
            editing: true,
            fields: [
                { name: "NameChi", title: '項目', type: "text", width: 50, align: "left", editing: false, },
                {
                    name: "Cost", title: '成本', type: "text", width: 20, align: "right", editing: false,
                    itemTemplate: jsGridTemplate.currency
                },
                {
                    name: "Price", title: '價格', type: "text", width: 20, align: "right",
                    itemTemplate: jsGridTemplate.currency, editing: true,
                    editTemplate: jsGridTemplate.editPressEnterToUpdate,
                },
                { type: "control", width: 10, editButton: false },
            ]
        });

        $("#jsgrid_SelectedGroupB", _container).jsGrid({
            width: "100%",
            height: _height,
            data: _args.GroupB,
            rowClick: function (args) {
                $("#jsgrid_SelectedItemB", _container).jsGrid('option', 'data', args.item.ExamItems);
            },
            onItemDeleted: function (args) {
                $("#jsgrid_SelectedItemB", _container).jsGrid('option', 'data', []);
            },
            fields: [
                { name: "Name", title: '群組', type: "text", width: 100, align: "left" },
                { type: "control", width: 10, editButton: false },
            ]
        });

        $("#jsgrid_SelectedItemB", _container).jsGrid({
            width: "100%",
            height: _height,
            data: [],
            fields: [
                { name: "NameChi", title: '項目', type: "text", width: 50, align: "left" },
                {
                    name: "Cost", title: '成本', type: "text", width: 20, align: "right",
                    itemTemplate: jsGridTemplate.currency
                },
                {
                    name: "Price", title: '價格', type: "text", width: 20, align: "right",
                    itemTemplate: jsGridTemplate.currency
                },
                { type: "control", width: 10, editButton: false },
            ]
        });

        $("#jsgrid_SelectedGroupC", _container).jsGrid({
            width: "100%",
            height: _height,
            data: _args.GroupC,
            rowClick: function (args) {
                $("#jsgrid_SelectedItemC", _container).jsGrid('option', 'data', args.item.ExamItems);
            },
            onItemDeleted: function (args) {
                $("#jsgrid_SelectedItemC", _container).jsGrid('option', 'data', []);
            },
            fields: [
                { name: "Name", title: '群組', type: "text", width: 100, align: "left" },
                { type: "control", width: 10, editButton: false },
            ]
        });

        $("#jsgrid_SelectedItemC", _container).jsGrid({
            width: "100%",
            height: _height,
            data: [],
            fields: [
                { name: "NameChi", title: '項目', type: "text", width: 50, align: "left" },
                {
                    name: "Cost", title: '成本', type: "text", width: 20, align: "right",
                    itemTemplate: jsGridTemplate.currency
                },
                {
                    name: "Price", title: '價格', type: "text", width: 20, align: "right",
                    itemTemplate: jsGridTemplate.currency
                },
                { type: "control", width: 10, editButton: false },
            ]
        });

        $("#jsgrid_SelectedGroupD", _container).jsGrid({
            width: "100%",
            height: _height,
            data: _args.GroupD,
            rowClick: function (args) {
                $("#jsgrid_SelectedItemD", _container).jsGrid('option', 'data', args.item.ExamItems);
            },
            onItemDeleted: function (args) {
                $("#jsgrid_SelectedItemD", _container).jsGrid('option', 'data', []);
            },
            fields: [
                { name: "Name", title: '群組', type: "text", width: 100, align: "left" },
                { type: "control", width: 10, editButton: false },
            ]
        });

        $("#jsgrid_SelectedItemD", _container).jsGrid({
            width: "100%",
            height: _height,
            data: [],
            fields: [
                { name: "NameChi", title: '項目', type: "text", width: 50, align: "left" },
                {
                    name: "Cost", title: '成本', type: "text", width: 20, align: "right",
                    itemTemplate: jsGridTemplate.currency
                },
                {
                    name: "Price", title: '價格', type: "text", width: 20, align: "right",
                    itemTemplate: jsGridTemplate.currency
                },
                { type: "control", width: 10, editButton: false },
            ]
        });

        $("#jsgrid_SelectedGroupE", _container).jsGrid({
            width: "100%",
            height: _height,
            data: _args.GroupE,
            rowClick: function (args) {
                $("#jsgrid_SelectedItemE", _container).jsGrid('option', 'data', args.item.ExamItems);
            },
            onItemDeleted: function (args) {
                $("#jsgrid_SelectedItemE", _container).jsGrid('option', 'data', []);
            },
            fields: [
                { name: "Name", title: '群組', type: "text", width: 100, align: "left" },
                { type: "control", width: 10, editButton: false },
            ]
        });

        $("#jsgrid_SelectedItemE", _container).jsGrid({
            width: "100%",
            height: _height,
            data: [],
            fields: [
                { name: "NameChi", title: '項目', type: "text", width: 50, align: "left" },
                {
                    name: "Cost", title: '成本', type: "text", width: 20, align: "right",
                    itemTemplate: jsGridTemplate.currency
                },
                {
                    name: "Price", title: '價格', type: "text", width: 20, align: "right",
                    itemTemplate: jsGridTemplate.currency
                },
                { type: "control", width: 10, editButton: false },
            ]
        });

        $("#jsgrid_SelectedGroupBonus", _container).jsGrid({
            width: "100%",
            height: _height,
            data: _args.GroupBonus,
            rowClick: function (args) {
                $("#jsgrid_SelectedItemBonus", _container).jsGrid('option', 'data', args.item.ExamItems);
            },
            onItemDeleted: function (args) {
                $("#jsgrid_SelectedItemBonus", _container).jsGrid('option', 'data', []);
            },
            fields: [
                { name: "Name", title: '群組', type: "text", width: 100, align: "left" },
                { type: "control", width: 10, editButton: false },
            ]
        });

        $("#jsgrid_SelectedItemBonus", _container).jsGrid({
            width: "100%",
            height: _height,
            data: [],
            fields: [
                { name: "NameChi", title: '項目', type: "text", width: 50, align: "left" },
                { type: "control", width: 10, editButton: false },
            ]
        });

        $(document).ready(function () {
            base.showTotalCost($("#jsgrid_SelectedGroupA", _container));
            base.showTotalCost($("#jsgrid_SelectedGroupB", _container));
            base.showTotalCost($("#jsgrid_SelectedGroupC", _container));
            base.showTotalCost($("#jsgrid_SelectedGroupD", _container));
        });
    })();

    $(".jsgrid-grid-body", _container)
        .css("overflow-x", 'auto')
        .css("overflow-y", 'scroll');

    return this;
});