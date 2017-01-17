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
    ('Promise' in window) || loadScript('//beta.esvibe.com/wp-content/themes/esvibe/dist/vendor/es6-promise.auto.js');
    ('requestAnimationFrame' in window) || loadScript('//beta.esvibe.com/wp-content/themes/esvibe/dist/vendor/requestanimationframe.js');
    (typeof CustomEvent === 'function') || loadScript('//beta.esvibe.com/wp-content/themes/esvibe/dist/vendor/customevents.js');
    ('srcset' in document.createElement('img')) || loadScript('//cdnjs.cloudflare.com/ajax/libs/picturefill/3.0.2/picturefill.min.js');
    ('dataset' in document.createElement('div')) || loadScript('//beta.esvibe.com/wp-content/themes/esvibe/dist/vendor/dataset.js');
    ('classList' in document.createElement('div')) || loadScript('//beta.esvibe.com/wp-content/themes/esvibe/dist/vendor/classList.js');
    (window.history && window.history.pushState) || loadScript('//beta.esvibe.com/wp-content/themes/esvibe/dist/vendor/native.history.js');
    ('import' in document.createElement('link') || 'createShadowRoot' in HTMLElement.prototype || 'content' in document.createElement('template')) || loadScript('//beta.esvibe.com/wp-content/themes/esvibe/dist/vendor/webcomponents-lite.js');
}());