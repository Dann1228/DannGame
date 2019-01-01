base.cookie = function (opt) {
    var _pageKey = opt.PageKey;
    var _jsGrid = opt.Grid;
    var _conditions = opt.Conditions;

    base.cookiePager = new base.CookieController({
        prefix: 'pager_',
        defaultValue: 1,
    });
    base.cookieCondition = new base.CookieController({
        prefix: 'condition_',
        defaultValue: '',
    });

    function getConditionFromCookie() {
        for (var idx = 0; idx < _conditions.length; idx++) {
            if (_conditions[idx] && _conditions[idx].is(':radio')) {
                if (_conditions[idx].val() === base.cookieCondition.get(_pageKey + '_' + getName(_conditions[idx]))) {
                    _conditions[idx].prop('checked', true);
                }
            }
            else {
                _conditions[idx].val(base.cookieCondition.get(_pageKey + '_' + getName(_conditions[idx])));
            }
        }
    }

    function setConditionToCookie() {
        base.cookiePager.set(_pageKey + '_PageIndex', _jsGrid.jsGrid('option', 'pageIndex'));
        for (var idx = 0; idx < _conditions.length; idx++) {
            base.cookieCondition.set(_pageKey + '_' + getName(_conditions[idx]), _conditions[idx].val());
        }
    }

    function clearCookies() {
        for (var idx = 0; idx < _conditions.length; idx++) {
            base.cookieCondition.clear(_pageKey + '_' + getName(_conditions[idx]));
        }

        base.cookiePager.clear(_pageKey + '_PageIndex');
    }

    return {
        getFromCookie: getConditionFromCookie,
        setIntoCookie: setConditionToCookie,
        clear: clearCookies,
        getPageIndex: function () { return parseInt(base.cookiePager.get(_pageKey + '_PageIndex')); }
    };
};