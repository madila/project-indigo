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
    ('Promise' in window) || loadScript(window.indigo.vendor_url+'/es6-promise.auto.js');
    ('requestAnimationFrame' in window) || loadScript(window.indigo.vendor_url+'/requestanimationframe.js');
    (typeof CustomEvent === 'function') || loadScript(window.indigo.vendor_url+'/customevents.js');
    ('srcset' in document.createElement('img')) || loadScript('//cdnjs.cloudflare.com/ajax/libs/picturefill/3.0.2/picturefill.min.js');
    ('dataset' in document.createElement('div')) || loadScript(window.indigo.vendor_url+'/dataset.js');
    ('classList' in document.createElement('div')) || loadScript(window.indigo.vendor_url+'/classList.js');
    (window.history && window.history.pushState) || loadScript(window.indigo.vendor_url+'/native.history.js');
}());