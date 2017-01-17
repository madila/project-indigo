export class App {
    constructor() {

        this._importedElements = [];

        /* Debug mode
         if (window.hasOwnProperty('esvibe') && !window.esvibe.debug) {
         console = console || {};
         console.log = function () {
         };
         }*/

        /*
         System.import('lazysizes').then(function (lazySizes) {
         window.lazySizesConfig = window.lazySizesConfig || {};
         window.lazySizesConfig.init = false;
         lazySizes.init();
         }); */

        window.dispatchEvent(new CustomEvent('appReady'));

        console.log('App is Ready');

    }

    init() {
        this.updateElements();
        this.initRouter();
    }

    static getCustomElementName(TagName) {
        return TagName.replace(/ +/g, '-').toLowerCase();
    }

    get importedElements() {
        return this._importedElements;
    }

    set importedElements(value) {
        this._importedElements.push(value);
    }

    initRouter() {
        Promise.all([
            System.import('director'),
            System.import('router')
        ]).then(function (modules) {
            let Router = modules[0],
                appRouter = modules[1];
            window.router = Router(appRouter.routes).configure(appRouter.routerConfig).init();
            console.log('Router Initialised as a window global...');

            document.documentElement.className = 'js';
            window.App.captureLinks();

            // Dispatch the event.
            window.dispatchEvent(new CustomEvent('systemReady'));

        }, function (err) {
            console.log(err);
            console.log('The router couldn\'t be loaded, default navigation.');
            // Dispatch the event.
            window.dispatchEvent(new CustomEvent('routerReady'));
        });
    }

    initSocial() {
        System.import('think-async').then(function (Async) {
            Async.add('instagram', '//platform.instagram.com/en_US/embeds.js', function () {
                window.addEventListener('viewUpdated', function (e) {
                    if (window.instgrm) {
                        instgrm.Embeds.process();
                    }
                });
            });
            Async.add('twitter', '//platform.twitter.com/widgets.js', function (id) {

            });
        });
    }

    lazyLoadElements(components) {

        components = (components == undefined) ? [].slice.call(document.querySelectorAll("[data-import]")) : components;

        let _self = this;

        components.forEach(function (element) {

            let ElementName,
                regex = new RegExp(' +', 'g');
            // Check if the Element extends an existing tag

            if (element.hasAttribute('is')) {

                ElementName = element.getAttribute("is").replace(regex, '-').toLowerCase();

            } else {

                ElementName = element.tagName.replace(regex, '-').toLowerCase();
            }
            if (_self.importedElements.indexOf(ElementName) == -1) {

                let elImport = document.createElement('link'),
                    dataImport = element.dataset.import;

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

    findAndLoadElements() {
        let components = [].slice.call(document.querySelectorAll("[data-import]"));
        if(components.length > 0) {
            window.App.lazyLoadElements(components);
            window.App.captureLinks();
        }
    }

    // Setup Link Click Events
    updateElements() {
        let components = [].slice.call(document.querySelectorAll("[data-import]"));
        if (components.length > 0) {
            this.lazyLoadElements(components);
        }
    }

    // Setup Link Click Events
    onClickEventHandler(event) {
        // Set the  to loading
        console.log('System is handling link event');
        if (this.href.indexOf(window.esvibe.site_url) > -1) {
            event.preventDefault();
            let link = this;
            if (link.href !== window.location.href) {
                //link.setAttribute('disabled', true);
                window.router.setRoute(this.href);
            }
        }
    }

    captureLinks() {
        let links = document.querySelectorAll('a[href]');
        for (let element in links) {
            if (links[element] instanceof Node && links[element].getAttribute('href') !== '#') {
                if (links[element].hasAttribute("data-prevent-default")) {
                    links[element].addEventListener('click', function (e) {
                        e.preventDefault();
                    });

                } else {
                    links[element].addEventListener('click', this.onClickEventHandler);
                }
            }
        }
    }
}