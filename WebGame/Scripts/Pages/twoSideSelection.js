base.twoSideSelection = function (param) {
    var urlSelect = param.urlSelect || '';
    var data = param.data || {};
    var urlUpdate = param.urlUpdate || '';
    var divModalPanel = param.divModalPanel || '#modalPanel';

    $.ajax({
        url: urlSelect,
        data: data,
    }).done(function (resp) {
        $(divModalPanel).html(resp);
        $("button.update", divModalPanel).click(function (e) {
            var to = [];
            var target = $("select[name='to[]']", divModalPanel);
            $.each(target.find('option'), function (val, elem) {
                to.push({ Value: $(elem).val(), Text: $(elem).text() });
            });

            $.ajax({
                url: urlUpdate,
                data: { Id: target.attr('data-id') , To: to},
            }).done(function (resp) {
                if (resp.Code == "200") {
                    alert(resp.Message);
                    $(divModalPanel).modal('toggle');
                }
                else {
                    alert(resp.Message);
                }
            }).fail(function (resp) {
                alert(resp);
            });
        });
        $(divModalPanel).modal('toggle');
    });
}