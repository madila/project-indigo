//Google Web Font Loader
var font = document.querySelectorAll('meta[name="font-family"]');
if(font.length > 0) {
    var fonts = [];
    for(var i = 0; i < font.length; i++) {
        fonts.push(font[i].content);
    }
    System.import('webfontloader.js').then(function (WebFont) {
        console.log(fonts);
        WebFont.load({
            google: {
                families: fonts
            }
        });
    });
}