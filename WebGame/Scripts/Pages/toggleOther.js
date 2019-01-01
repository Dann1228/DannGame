base.toggleOther = base.toggleOther || (function () {
    $.each($('select'), function (idx, elem) {
        if (typeof $(elem).attr('data-toggle-value') !== 'undefined') {
            var value = $(elem).attr('data-toggle-value');
            var id = $(elem).attr('data-toggle-field')
            $(elem).on('change', function (e) {
                if ($(this).val() === value) {
                    $(id).show();
                }
                else {
                    $(id).val('');
                    $(id).hide();
                }
            });

            $(elem).change();
        }
    });
})();