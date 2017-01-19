function logFontLoaded(o) {
    console.log(o.family, "loaded successfully.")
}

if("FontFace" in window) {
    var PoppinsFontFace = new FontFace("Poppins", "url(https://fonts.gstatic.com/s/poppins/v1/HLBysyo0MQBO_7E-DWLwzg.woff2)", {
        style: "normal",
        unicodeRange: "U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000",
        weight: "400"
    });
    document.fonts.add(PoppinsFontFace), PoppinsFontFace.loaded.then(logFontLoaded), document.fonts.ready.then(function () {
        document.body.style.fontFamily = "Poppins, sans-serif"
    });
}