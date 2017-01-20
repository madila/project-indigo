export class App {
    constructor() {

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
        let _self = this;
        Promise.all([
            System.import('director.js'),
            System.import('router.js')
        ]).then(function (modules) {
            let Router = modules[0],
                appRouter = modules[1];
            window.router = Router(appRouter.routes).configure(appRouter.routerConfig).init();
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

    initSocial() {
        System.import('think-async.js').then(function (Async) {
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

    // Setup Link Click Events
    updateElements(components) {
        components = (components == undefined) ? [].slice.call(document.querySelectorAll("[data-import]")) : components;
        if (components.length > 0) {
            this.lazyLoadElements(components);
        }
    }

    animateElement(element) {
        window.requestAnimationFrame(function() {
            const animate = element.dataset.animate;
            if (element == undefined) return false;
            if (animate) element.classList.add('animate--'+animate);
            element.removeAttribute("unresolved");
        });
    }

    // Setup Link Click Events
    onClickEventHandler(event) {
        // Set the  to loading
        console.log('System is handling link event');
        // Check if the link contains the site url (relative urls have the domain appended to the href attribute).
        if (event.target.href.indexOf(window.indigo.site_url) > -1) {
            event.preventDefault();
            console.log('router');
            let link = event.target;
            if (link.href !== window.location.href) {
                //link.setAttribute('disabled', true);
                window.router.setRoute(event.target.href);
            }
        }
    }

    captureLinks(links) {
        links = (links == undefined) ? document.querySelectorAll('a[href]') : links;
        for (let element in links) {
            if (links[element] instanceof Node && links[element].getAttribute('href') !== '#') {
                if (links[element].hasAttribute("data-prevent-default")) {
                    links[element].addEventListener('click', function (e) {
                        e.preventDefault();
                    });
                } else if(links[element].attached) {
                    continue;
                } else {
                    links[element].addEventListener('click', this.onClickEventHandler);
                    links[element].attached = true;
                }
                console.log(links[element]);
            }
        }
    }
}