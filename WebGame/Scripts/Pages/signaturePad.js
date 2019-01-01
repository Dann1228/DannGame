function signaturePad(selector) {
    var canvas = $(selector)[0];

    var signaturePad = new SignaturePad(canvas, {
        // It's Necessary to use an opaque color when saving image as JPEG;
        // this option can be omitted if only saving as PNG or SVG
        backgroundColor: 'rgb(255, 255, 255)',
    });

    // Adjust canvas coordinate space taking into account pixel ratio,
    // to make it look crisp on mobile devices.
    // This also causes canvas to be cleared.
    this.resizeCanvas = function () {
        // When zoomed out to less than 100%, for some very strange reason,
        // some browsers report devicePixelRatio as less than 1
        // and only part of the canvas is cleared then.
        var ratio = Math.max(window.devicePixelRatio || 1, 1);

        // This part causes the canvas to be cleared
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        // canvas.width = canvas.width * ratio;
        // canvas.height = canvas.height * ratio;
        canvas.getContext("2d").scale(ratio, ratio);

        // This library does not listen for canvas changes, so after the canvas is automatically
        // cleared by the browser, SignaturePad#isEmpty might still return false, even though the
        // canvas looks empty, because the internal data of this library wasn't cleared. To make sure
        // that the state of this library is consistent with visual state of the canvas, you
        // have to clear it manually.
        // signaturePad.clear();
    }

    // On mobile devices it might make more sense to listen to orientation change,
    // rather than window resize events.
    window.onresize = this.resizeCanvas;

    this.clear = function () {
        signaturePad.clear();
    }

    this.toField = function (dom) {
        var svg = signaturePad.toDataURL('image/svg+xml');
        $(dom).val(svg);
    }
};