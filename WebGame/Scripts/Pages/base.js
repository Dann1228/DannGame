var base = base || (function () {

    var cookieHandler = (function () {
        var _cookieObject = [];
        _cookieObject = resetCookieObject();

        function resetCookieObject() {
            var str = decodeURIComponent(document.cookie);
            var values = str.split(';');
            var rtn = [];
            for (var i = 0; i < values.length; i++) {
                if (values[i].trim() === '') { continue; }
                var pair = values[i].trim().split('=');

                rtn[pair[0]] = pair[1];
            }
            return rtn;
        }

        function getExpiresTime() {
            var time = new Date();
            time.setMinutes(time.getMinutes() + 20);
            return time;
        }

        function getExpiredTime() {
            var time = new Date();
            time.setMinutes(time.getMinutes() - 20);
            return time;
        }


        function setCookie(key, value) {
            var str = key + '=' + value;
            document.cookie = str + ";expires=" + getExpiresTime().toUTCString();
            resetCookieObject();
        }

        function deleteCookie(key) {
            var str = key + '=';
            document.cookie = str + ";expires=" + getExpiredTime().toUTCString();
            resetCookieObject();
        }

        function getCookie(key) {
            return _cookieObject[key];
        }

        return {
            setCookie: setCookie,
            getCookie: getCookie,
            deleteCookie: deleteCookie,
        };
    })();

    this.CookieController = function (opt) {
        var _prefix = opt.prefix;
        var _defaultValue = opt.defaultValue;

        function setPager(pageKey, pageIndex) {
            cookieHandler.setCookie(_prefix + pageKey, pageIndex);
        }
        function clearPager(pageKey) {
            cookieHandler.deleteCookie(_prefix + pageKey);
        }

        function getPager(pageKey) {
            var rtn = cookieHandler.getCookie(_prefix + pageKey);
            if (rtn === undefined || rtn === '') {
                return _defaultValue;
            }
            else {
                return rtn;
            }
        }

        return {
            get: getPager,
            set: setPager,
            clear: clearPager,
        }
    } 

    this.conf = {
        activeMenu: {},
        formValidator: {},
        deleteConfirmMessage: '是否刪除？',
    };

    this.toJavascriptDate = (function (jdate) {
        // show in yyyy/mm/dd
        var date = '';
        if (jdate != undefined && jdate != '') {
            var re = /-?\d+/;
            var m = re.exec(jdate);
            var dt = new Date(parseInt(m[0]));
            //var dt = new Date(jdate.replace(/-/g, "/"))
            var yyyy = dt.getFullYear();
            var mm = dt.getMonth() + 1;
            var dd = dt.getDate();
            if (yyyy != 1) {
                var strmm = mm.toString();
                var strdd = dd.toString();
                if (strmm.length == 1) {
                    strmm = '0' + strmm;
                }
                if (strdd.length == 1) {
                    strdd = '0' + strdd;
                }
                date = yyyy + '/' + strmm + '/' + strdd;
            }
        }
        return date;
    });

    var init = (function () {
        $.fn.datetimepicker.defaults.locale = 'zh-tw';
        $.fn.datetimepicker.defaults.format = 'YYYY/MM/DD hh:mm';
        $.fn.datepicker = function () {
            return $(this).datetimepicker({ format: 'YYYY/MM/DD' });
        };
        $.fn.datepicker_minDate = function (minDate) {
            return $(this).datetimepicker({
                format: 'YYYY/MM/DD',
                minDate: minDate == null ? new Date() : minDate,
            });
        };

        $.fn.valid = function () {
            $('label.error[for="' + $(this).attr('id') + '"]').remove();
            // conf.formValidator.element(this);
            // $(this).prototype.valid();
        }

        Array.prototype.drop = function (items) {
            if (Array.isArray(items)) {
                for (var i = 0; i < this.length; i++) {
                    for (var j = 0; j < items.length; j++) {
                        if (this[i] === items[j]) {
                            this.splice(i, 1);
                        }
                    }
                }
            }
            else {
                this.splice(this.indexOf(items.toString()), 1);
            }
        }

        /// 數字轉貨幣格式
        Number.prototype.toCurrency = function () {
            var rtn = '', _this = this.toString();
            var digit = 0;
            for (var idx = _this.length - 1; idx >= 0; idx--) {
                if (digit !== 0 && digit % 3 === 0) {
                    rtn = ',' + rtn;
                }

                rtn = _this[idx] + rtn;
                digit++;
            }

            return '$ ' + rtn;
        };

        /// 文字轉貨幣格式
        String.prototype.toCurrency = function () {
            return Number(this) !== NaN ? Number(this).toCurrency() : '0'.toCurrency();
        }

        Date.prototype.toYYYYMMDD = function () {
            var mm = this.getMonth() + 1; // getMonth() is zero-based
            var dd = this.getDate();

            return [this.getFullYear(),
            (mm > 9 ? '' : '0') + mm,
            (dd > 9 ? '' : '0') + dd
            ].join('/');
        }

        function _toHiddenInput(name, obj) {
            var genName = '';
            var genValue = '';
            if (typeof obj === 'object' && obj !== null) {
                if (Array.isArray(obj)) {
                    for (var i = 0; i < obj.length; i++) {
                        _toHiddenInput(name + '[' + i + ']', obj[i]);
                    }
                }
                else {
                    var keys = Object.keys(obj);
                    for (var key in keys) {
                        _toHiddenInput(name + '.' + keys[key], obj[keys[key]]);
                    }
                }
            }
            else {
                genName = name;
                genValue = obj;
                $('form').append("<input type='hidden' name='" + genName + "' value='" + genValue + "' />")
            }
        }

        $.fn.genInputs = function () {
            for (var idxGrid = 0; idxGrid < $(this).length; idxGrid++) {
                if ($($(this)[idxGrid]).hasClass('jsgrid')) {
                    var items = $($(this)[idxGrid]).jsGrid('option', 'data');
                    _toHiddenInput($($(this)[idxGrid]).attr('name'), items);
                }

            }

        }

        $.validator.setDefaults({
            errorPlacement: function (error, elem) {
                if (elem.attr('data-group') !== undefined) {
                    var groupName = elem.attr('data-group');
                    if ($('label.error[group="' + groupName + '"]:visible').length == 0) {
                        error.attr('group', groupName);
                        error.insertAfter(elem.closest('div'));
                    }
                } else if (elem.is(':radio')) {
                    var eid = elem.attr('name');
                    error.insertAfter($('<br />').insertAfter($('input[name=' + eid + ']:last').closest('label')));
                } else if (elem.is(':checkbox')) {
                    var eid = elem.attr('data-name');
                    error.insertAfter($('<br />').insertAfter($('input[data-name=' + eid + ']:last').closest('label')));
                } else {
                    error.insertAfter(elem);
                }
            },
            onkeyup: function (elem) { $(elem).valid(); },

        });

        $.ajaxSetup({
            type: 'POST',
            beforeSend: function () {
                $.blockUI();
            },
            complete: function () {
                $.unblockUI();
            }
        });



        $(document).ready(function () {
            $('input, select').change(function (e) {
                var group = $(this).attr('data-group');
                if (group === undefined) {
                    $(this).valid();
                } else {
                    for (var i = 0; i < $('input[data-group="' + group + '"]').length; i++) {
                        var item = $($('input[data-group="' + group + '"]')[i]);
                        if (item.attr('id') === $(this).attr('id')) { continue; }
                        item.valid();
                    }
                    for (var i = 0; i < $('select[data-group="' + group + '"]').length; i++) {
                        var item = $($('select[data-group="' + group + '"]')[i]);
                        if (item.attr('id') === $(this).attr('id')) { continue; }
                        item.valid();
                    }
                }
            });

            $.each($(".jsgrid"), function (idx, elem) {
                if ($(elem).jsGrid('option', 'paging') === true) {
                    $(elem).find(".jsgrid-grid-header").css('overflow', 'auto');
                }
            });


            $('input').on('dp.hide', function (e) {
                $(this).change();
            });

            $("[data-range-start-end=Start]").datepicker().on("dp.change", function () {
                if ($(this).val() != '') {
                    $(this).siblings("[data-range-start-end=End]").data("DateTimePicker").minDate($(this).val());
                }
            });
            $("[data-range-start-end=End]").datepicker().on("dp.change", function () {
                if ($(this).val() != '') {
                    $(this).siblings("[data-range-start-end=Start]").data("DateTimePicker").maxDate($(this).val());
                }
            });

            $('.button-style-radio').buttonGroup();

            $('form').on('submit', function () {
                var grids = $('.jsgrid');
                for (var idx = 0; idx < grids.length; idx++) {
                    if ($(grids[idx]).attr('name') !== undefined) {
                        $(grids[idx]).genInputs();
                    }
                }
            });
        });

    })();


    return this;
})();