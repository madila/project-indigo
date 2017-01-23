System.config({
    baseURL: indigo.js_dist_url,
    meta: {
        'jquery.js': {
            exports: 'jQuery',
            format: 'global'
        },
        'x-tag-no-polyfills.js': {
            format: 'global'
        }
    }
});

window.indigo = window.indigo || {};

window.define = System.amdDefine;
window.require = window.requirejs = System.amdRequire;

// Create systemReady event
window.addEventListener('systemReady', function () {
    console.log('System is ready');
    window.dispatchEvent(new CustomEvent('viewUpdated'));
});

// Document is ready, init the app
document.addEventListener( "DOMContentLoaded", function() {

    document.documentElement.classList.add('is-entering');
    console.log('document is ready');
    System.import('indigo.js').then(function (exports) {
        console.log('App has been imported');
        "use strict";
        console.log(exports);
        var App = new exports.App();
        window.App = App;
        window.App.init();
    });

});