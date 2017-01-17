System.config({
    baseURL: indigo.site_url,
    'map': {
        'indigo': 'dist/js/indigo.js',
        'transit': 'dist/js/transit.js',
        'router': 'dist/js/router.js',
        'webcomponents': 'dist/vendor/webcomponents-lite.js',
        'think-async': 'dist/vendor/think-async.js',
        'jquery': 'dist/vendor/jquery.js',
        'tether': 'dist/vendor/tether.js',
        'bootstrap': 'dist/vendor/bootstrap.js',
        'history': 'dist/vendor/native.history.js',
        'offline': 'dist/vendor/offline.js',
        'picturefill': 'dist/vendor/picturefill.js',
        'lazysizes': 'dist/vendor/lazysizes.js',
        'director': 'dist/vendor/director.js',
        'classList': 'dist/vendor/domtokenlist.js',
        'webfontloader': 'https://cdnjs.cloudflare.com/ajax/libs/webfont/1.6.26/webfontloader.js'
    },
    meta: {
        'jquery': {
            exports: 'jQuery',
            format: 'global'
        },
        'tether': {
            exports: 'Tether',
            format: 'global'
        },
        'think-async': {
            exports: 'Async',
            format: 'global'
        },
        'bootstrap': {
            deps: ['jquery', 'tether']
        }
    }
});

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
    System.import('indigo').then(function (exports) {
        console.log('App has been imported');
        "use strict";
        console.log(exports);
        var App = new exports.App();
        window.App = App;
        window.App.init();
    });

});

window.esvibe = window.esvibe || {};