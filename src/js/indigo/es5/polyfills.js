(function() {
    var doc = document,
        html = doc.documentElement,
        fjs = doc.getElementsByTagName('script')[0];
    html.className = html.className = 'js';
    var loadScript = function(url) {
        var js = doc.createElement('script');
        js.src = url;
        fjs.parentNode.insertBefore(js, fjs);
    };
    /** Page blocking pofyllis if needed **/
    ('Promise' in window) || loadScript(window.indigo.js_dist_url+'/es6-promise.auto.js');
    ('requestAnimationFrame' in window) || loadScript(window.indigo.js_dist_url+'/raf.js');
    (typeof CustomEvent === 'function') || loadScript(window.indigo.js_dist_url+'/custom-event-polyfill.js');
    ('srcset' in document.createElement('img')) || loadScript(window.indigo.js_dist_url+'/picturefill.js');
    ('dataset' in document.createElement('div')) || loadScript(window.indigo.js_dist_url+'/dataset.js');
    ('classList' in document.createElement('div')) || loadScript(window.indigo.js_dist_url+'/classList.js');
    (window.history && window.history.pushState) || loadScript(window.indigo.js_dist_url+'/native.history.js');
    ('registerElement' in document && 'import' in document.createElement('link') && 'createShadowRoot' in HTMLElement.prototype && 'content' in document.createElement('template')) || loadScript(window.indigo.js_dist_url+'/webcomponents-lite.js');
}());