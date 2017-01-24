'use strict';

System.register([], function (_export, _context) {
    "use strict";

    var _createClass, App;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [],
        execute: function () {
            _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }

                return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            _export('App', App = function () {
                function App() {
                    _classCallCheck(this, App);

                    this._importedElements = [];

                    /* Debug mode
                     if (window.hasOwnProperty('indigo') && !window.indigo.debug) {
                     console = console || {};
                     console.log = function () {
                     };
                     }*/

                    /*
                     System.import('lazysizes.js').then(function (lazySizes) {
                     window.lazySizesConfig = window.lazySizesConfig || {};
                     window.lazySizesConfig.init = false;
                     lazySizes.init();
                     }); */

                    window.dispatchEvent(new CustomEvent('appReady'));
                    console.log('App is Ready');
                }

                _createClass(App, [{
                    key: 'init',
                    value: function init() {
                        this.initRouter();
                        var App = this;
                        App.updateElements();
                    }
                }, {
                    key: 'initRouter',
                    value: function initRouter() {
                        var _self = this;
                        Promise.all([System.import('director.js'), System.import('router.js')]).then(function (modules) {
                            var director = modules[0],
                                appRouter = modules[1];

                            window.router = director(appRouter.routes).configure(appRouter.routerConfig).init();
                            console.log('Router Initialised as a window global...');

                            document.documentElement.className = 'js';
                            _self.captureLinks();

                            // Dispatch the event.
                            window.dispatchEvent(new CustomEvent('routerReady'));
                        }, function (err) {
                            console.log(err);
                            console.log('The router couldn\'t be loaded, default navigation.');
                            // Dispatch the event.
                            window.dispatchEvent(new CustomEvent('routerReady'));
                        });
                    }
                }, {
                    key: 'initSocial',
                    value: function initSocial() {
                        System.import('think-async.js').then(function (Async) {
                            Async.add('instagram', '//platform.instagram.com/en_US/embeds.js', function () {
                                window.addEventListener('viewUpdated', function (e) {
                                    if (window.instgrm) {
                                        instgrm.Embeds.process();
                                    }
                                });
                            });
                            Async.add('twitter', '//platform.twitter.com/widgets.js', function (id) {});
                        });
                    }
                }, {
                    key: 'lazyLoadElements',
                    value: function lazyLoadElements(components) {

                        components = components == undefined ? [].slice.call(document.querySelectorAll("[data-import]")) : components;

                        var _self = this;

                        components.forEach(function (element) {

                            var ElementName = void 0,
                                regex = new RegExp(' +', 'g');
                            // Check if the Element extends an existing tag

                            if (element.hasAttribute('is')) {

                                ElementName = element.getAttribute("is").replace(regex, '-').toLowerCase();
                            } else {

                                ElementName = element.tagName.replace(regex, '-').toLowerCase();
                            }
                            console.log(_self.importedElements.indexOf(ElementName));
                            if (_self.importedElements.indexOf(ElementName) == -1) {

                                var elImport = document.createElement('link'),
                                    dataImport = element.dataset.import;

                                delete element.dataset.import;

                                elImport.rel = 'import';

                                if (dataImport == '') {
                                    elImport.href = window.indigo.components_url + ElementName + '.html';
                                } else {
                                    elImport.href = window.indigo.components_url + dataImport;
                                }

                                document.head.appendChild(elImport);

                                _self.importedElements = ElementName;
                            }
                        });
                    }
                }, {
                    key: 'updateElements',
                    value: function updateElements(components) {
                        components = components == undefined ? [].slice.call(document.querySelectorAll("[data-import]")) : components;
                        if (components.length > 0) {
                            this.lazyLoadElements(components);
                        }
                    }
                }, {
                    key: 'animateElement',
                    value: function animateElement(element) {
                        window.requestAnimationFrame(function () {
                            var animate = element.dataset.animate;
                            if (element == undefined) return false;
                            if (animate) element.classList.add('animate--' + animate);
                            element.removeAttribute("unresolved");
                        });
                    }
                }, {
                    key: 'onClickEventHandler',
                    value: function onClickEventHandler(event) {
                        // Set the  to loading
                        console.log('System is handling link event');
                        // Check if the link contains the site url (relative urls have the domain appended to the href attribute).
                        if (event.target.href.indexOf(window.indigo.site_url) > -1) {
                            event.preventDefault();
                            console.log('router');
                            var link = event.target;
                            if (link.href !== window.location.href) {
                                //link.setAttribute('disabled', true);
                                window.router.setRoute(event.target.href);
                            }
                        }
                    }
                }, {
                    key: 'captureLinks',
                    value: function captureLinks(links) {
                        links = links == undefined ? document.querySelectorAll('a[href]') : links;
                        for (var element in links) {
                            if (links[element] instanceof Node && links[element].getAttribute('href') !== '#') {
                                if (links[element].hasAttribute("data-prevent-default")) {
                                    links[element].addEventListener('click', function (e) {
                                        e.preventDefault();
                                    });
                                } else if (links[element].attached) {
                                    continue;
                                } else {
                                    links[element].addEventListener('click', this.onClickEventHandler);
                                    links[element].attached = true;
                                }
                                console.log(links[element]);
                            }
                        }
                    }
                }, {
                    key: 'importedElements',
                    get: function get() {
                        return this._importedElements;
                    },
                    set: function set(value) {
                        this._importedElements.push(value);
                    }
                }], [{
                    key: 'getCustomElementName',
                    value: function getCustomElementName(TagName) {
                        return TagName.replace(/ +/g, '-').toLowerCase();
                    }
                }]);

                return App;
            }());

            _export('App', App);
        }
    };
});