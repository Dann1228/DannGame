// base.printPreview = (function (byteString) {
//     var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
//     if (base64regex.test(byteString)) {
//         //將字串轉回資料
//         var binaryString = window.atob(byteString);
//         var binaryLen = binaryString.length;
//         var bytes = new Uint8Array(binaryLen);
//         for (var i = 0; i < binaryLen; i++) {
//             var ascii = binaryString.charCodeAt(i);
//             bytes[i] = ascii;
//         }
//         //轉成pdf檔
//         var file = new Blob([bytes], { type: 'application/pdf' });
//         var fileURL = URL.createObjectURL(file);//創造一個URL
// 
//         return fileURL;
//     }
//     return '';
// });

base.printPreview = (function (byteString) {
    var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    var iframeId = 'PrintReceiptFrame';

    function getUrl(byteString) {
        //將字串轉回資料
        var binaryString = window.atob(byteString);
        var binaryLen = binaryString.length;
        var bytes = new Uint8Array(binaryLen);
        for (var i = 0; i < binaryLen; i++) {
            var ascii = binaryString.charCodeAt(i);
            bytes[i] = ascii;
        }
        //轉成pdf檔
        var file = new Blob([bytes], { type: 'application/pdf' });
        var fileURL = URL.createObjectURL(file);//創造一個URL

        return fileURL;
    }

    if (base64regex.test(byteString)) {
        var url = getUrl(byteString);
        var iFrame = $('<iframe id="' + iframeId + '" class="hidden" style="width: 100 %; height: 500px"></iframe>').attr("src", url);
        $("#" + iframeId).remove();
        $('body').append(iFrame);

        iFrame.load(function () {
            this.contentWindow.print();
        });
    }
    return '';
});
