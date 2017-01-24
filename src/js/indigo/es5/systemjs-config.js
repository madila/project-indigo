if(typeof indigoConfig == "undefined") throw "Project Indigo requires a IndigoConfig variable.";

window.indigo = indigoConfig;

// Debug mode
if (window.indigo.hasOwnProperty('debug') && !window.indigo.debug) {
    console = console || {};
    console.log = function () {};
}

System.config({
    baseURL: indigo.dist_url+'/js',
    meta: {
        'jquery.js': {
            exports: 'jQuery',
            format: 'global'
        },
        'indigo.es6.js': {
            format: 'global'
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

    System.import('indigo.js').then(function (exports) {
        console.log('App has been imported');
        "use strict";
        window.App = new exports.App();
    });

});