(function() {
    var doc = document,
        html = doc.documentElement,
        fjs = doc.getElementsByTagName('script')[0];
    html.className = html.className.replace('no-js', 'js');
    var loadScript = function(url) {
        var js = doc.createElement('script');
        js.src = url;
        fjs.parentNode.insertBefore(js, fjs);
    };
    /** Page blocking pofyllis if needed **/
    ('Promise' in window) || loadScript(window.indigo.dist_url+'/js/es6-promise.auto.js');
    ('requestAnimationFrame' in window) || loadScript(window.indigo.dist_url+'/js/raf.js');
    (typeof CustomEvent === 'function') || loadScript(window.indigo.dist_url+'/js/custom-event.js');
    ('srcset' in document.createElement('img')) || loadScript(window.indigo.dist_url+'/js/picturefill.js');
    ('dataset' in document.createElement('div')) || loadScript(window.indigo.dist_url+'/js/dataset.js');
    ('classList' in document.createElement('div')) || loadScript(window.indigo.dist_url+'/js/classList.js');
    (window.history && window.history.pushState) || loadScript(window.indigo.dist_url+'/js/native.history.js');
    ('registerElement' in document && 'import' in document.createElement('link') && 'createShadowRoot' in HTMLElement.prototype && 'content' in document.createElement('template')) || loadScript(window.indigo.dist_url+'/js/lite.js');
}());