function hideModal(modal) {
    $(modal).modal('hide');
    $(".modal-backdrop").remove();
    $('body').removeClass('modal-open');
    $('body').css('padding-right', '');
}

var jsGridTemplate = jsGridTemplate || (function () {
    this.customButton = function (value, item, callback, text) {
        var $result = jsGrid.fields.control.prototype.itemTemplate.apply(this, arguments);
        var $customButton = $('<button class="btn btn-default" type="button">').text(text).click(function (e) { callback(item.Id); });
        return $result.add($customButton);
    };

    this.customButtonSendItem = function (value, item, callback, text) {
        var $result = jsGrid.fields.control.prototype.itemTemplate.apply(this, arguments);
        var $customButton = $('<button class="btn btn-default" type="button">').text(text).click(function (e) { callback(item); });
        return $result.add($customButton);
    };

    this.currency = function (value) {
        return Number(value).toCurrency();
    }

    this.editPressEnterToUpdate = function (value) {
        var $result = jsGrid.fields.number.prototype.editTemplate.call(this, value);
        var $_grid = this._grid;
        $result.on("keydown", function (e) {
            if (e.which === 13) {
                $_grid.updateItem();
                return false;
            }
        });
        return $result;
    }
    this.customSelectIdCount = 0
    this.customSelect = function (value, item, codeGroups, changeEvent, selectIdName) {
        if (!selectIdName) {
            selectIdName = "";
        }
        var $result = jsGrid.fields.control.prototype.itemTemplate.apply(this, arguments);
        var $customSelect = $('<select class="form-control"></select>');
        var $_thisGrid = this._grid;
        $customSelect.attr("Id", selectIdName + customSelectIdCount)
        this.customSelectIdCount++;
        $.each(codeGroups, function (index, elem) {
            $customSelect.append(new Option(elem.Text, elem.Value, false, value == elem.Value));
        });
        $customSelect.change(changeEvent);
        return $result.add($customSelect);
    };

    this.customeEditControl = function (callback) {
        return {
            type: 'control', width: 30, align: "center", editButton: false,
            headerTemplate: function (value, item) {
                return $('<button class="jsgrid-button jsgrid-mode-button jsgrid-insert-mode-button" type="button">')
                    .on('click', function () { callback() });
            },
            _createEditButton: function (item) {
                var $result = jsGrid.fields.control.prototype._createEditButton.apply(this, arguments);
                $result.on("click", function (e) {
                    callback(item);
                });
                return $result;
            },
            itemTemplate: function (value, item) {
                var $result = $([]);
                $result = $result.add(this._createEditButton(item));
                $result = $result.add(this._createDeleteButton(item));

                return $result;
            }
        };
    }

    this.customLink = function (value, item, callback, text) {
        var $result = jsGrid.fields.control.prototype.itemTemplate.apply(this, arguments);
        var $customLink = $('<a>').text(text).click(function (e) { callback(value); });
        return $result.add($customLink);
    };

    this.customCheckbox = function (value, item) {
        var $result = jsGrid.fields.control.prototype.itemTemplate.apply(this, arguments);
        var $name = this._grid._container.attr('id');
        var $_thisGrid = this._grid;
        var $customChkbox = {};
        $_thisGrid.getCheckedValues();
        $customChkbox = $('<input>').attr("type", "checkbox").attr('data-name', $name)
            .val(value)
            .prop('checked', Array.isArray($_thisGrid.checkedValues) && $_thisGrid.checkedValues.indexOf(value.toString()) >= 0)
            .click(function (e) {
                if ($(this).prop('checked')) {
                    $_thisGrid.checkedValues.push($(this).val());
                }
                else {
                    var idx = $_thisGrid.checkedValues.indexOf($(this).val());
                    $_thisGrid.checkedValues.splice(idx, 1);
                }
                $('input[data-name="' + $name + 'header"]').prop('checked', $('input[data-name="' + $name + '"]').length == $('input[data-name="' + $name + '"]:checked').length);
                console.log($_thisGrid.checkedValues);
                event.stopPropagation();
            });

        return $result.add($customChkbox);
    }

    this.customHeaderDelete = function () {
        var $result = jsGrid.fields.control.prototype.itemTemplate.apply(this, arguments);
        var $_thisGrid = this._grid;

        var $deleteButton = $('<button class="jsgrid-button jsgrid-delete-button" type="button" />')
            .click(function (e) {
                if (window.confirm($_thisGrid.deleteConfirm)) {
                    var checkedValues = $_thisGrid.getCheckedValues();

                    for (var i = 0; i < $_thisGrid.data.length; i++) {
                        for (var j = 0; j < checkedValues.length; j++) {
                            if ($_thisGrid.data[i].Id.toString() === checkedValues[j]) {
                                $_thisGrid.data.splice(i, 1);
                            }
                        }
                    }

                    $_thisGrid.refresh();
                    if ($_thisGrid.gearing) {
                        $($_thisGrid.gearing).jsGrid('loadData');
                    }
                }

            });

        return $deleteButton;
    }

    this.customHeaderCheckbox = function () {
        var $result = jsGrid.fields.control.prototype.itemTemplate.apply(this, arguments);
        var $name = this._grid._container.attr('id');
        var $_thisGrid = this._grid;

        var $customChkbox = $('<input>').attr("type", "checkbox").attr('data-name', this.name + 'header').attr("id", "chk" + this.name)
            .val('')
            .click(function (e) {
                $('input[data-name="' + $name + '"]').prop('checked', $(this).prop('checked'));
                if ($(this).prop('checked')) {
                    $('input[data-name="' + $name + '"]').each(function () {
                        $(this).prop('checked', true);
                        if ($_thisGrid.checkedValues.indexOf($(this).val()) < 0) {
                            $_thisGrid.checkedValues.push($(this).val());
                        }
                    });
                }
                else {
                    $('input[data-name="' + $name + '"]').each(function () {
                        $(this).prop('checked', false);
                        var idx = $_thisGrid.checkedValues.indexOf($(this).val());
                        if (idx >= 0) {
                            $_thisGrid.checkedValues.splice(idx, 1);
                        }
                    });
                }
                console.log($_thisGrid.checkedValues);
            });
        return $result.add($customChkbox);
    }

    this.loadData = function (filter, opt) {
        var d = $.Deferred();
        var _opt = {
            url: opt.url || '',
            param: opt.param || {},
            isPaging: opt.isPaging === undefined ? true : opt.isPaging,
            afterDone: opt.afterDone || undefined,
        };
        _opt.param.Pager = {
            CurrentPageNumber: filter.pageIndex - 1,
            PageSize: filter.pageSize,
            HasPager: _opt.isPaging,
        };

        var rtn = $.ajax({
            url: _opt.url,
            data: _opt.param,
        }).done(function (response) {
            d.resolve({
                data: eval(response.data),
                itemsCount: response.itemsCount,
            });
            if (_opt.afterDone) { _opt.afterDone(); }
        });
        return d.promise();
    }

    //給唯獨用  編輯新增會有一些很麻煩的問題
    this.customRadio = function (value, item, radioSelectValue, radioName, callback) {
        var $result = jsGrid.fields.control.prototype.itemTemplate.apply(this, arguments);
        //外層button-style-radio
        var $customRadio = $('<div class="button-style-radio" style="display: none; "></div>');

        //內部每個按鈕製作
        for (var i = 0; i < radioSelectValue.length; i++) {
            var $radioLabel = $('<label class="radio-inline"></label>');
            var $inputSting = $('<input type="radio"   data-rule-required="true" data-msg-required="必選">');
            //給Name  Id  item要有這欄位
            $inputSting.attr("name", radioName + item.Id);
            $inputSting.attr("id", radioName + item.Id + radioSelectValue[i].Value);
            //給Value
            $inputSting.val(radioSelectValue[i].Value);
            //判斷check
            var checked = value == $inputSting.val();
            $inputSting.prop("checked", checked);
            //組合
            $customRadio.append($radioLabel.text(radioSelectValue[i].Text).append($inputSting));
        }
        //最外面再加一層div 不然按鈕出不來
        $customRadio.attr("name", radioName + item.Id);
        $customRadio = $("<div></div>").append($customRadio);
        //點擊事件
        $customRadio.click(callback);
        return $result.add($customRadio);
    };
    return this;
})();