(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['transit.js'], function (appRouter) {
            // Also create a global in case some scripts
            // that are loaded still are looking for
            // a global even when an AMD loader is in use.
            return (root.amdWebGlobal = factory(appRouter));
        });
    } else {
        // Browser globals
        root.amdWebGlobal = factory(root.transit);
    }
}(this, function (transit) {
    "use strict";

    transit = {
        data : null,
        /** Run before a page load has been activated */
        exit: {
            duration: 400,
            start: function (data) {
                System.import('jquery.js').then(function ($) {
                    $('html').addClass('is-exiting');
                    window.setTimeout(function () {
                        $(document).trigger('esvibe.onExitEnd');
                        $('html').addClass('is-loading').removeClass('is-exiting');
                        transit.ready.start(window.location.href, data);
                    }, transit.exit.duration);

                });
            }
        },
        /** Run once page has left, process data **/
        ready: {
            duration: 400,
            start: function (href, data) {

                System.import('jquery.js').then(function ($) {
                    var $html = $('html'),
                        $container = $('main'),
                        $newContent = transit.switchMain(data);

                    if ($html.hasClass('is-loading')) {
                        // Call the onReady callback and set delay
                        transit.enter.start($container, $newContent);
                    } else {
                        $(document).on('esvibe.onExitEnd', function () {
                            window.setTimeout(transit.enter.start($container, $newContent), 200);
                        });
                    }

                });

            }
        },

        /** Run when requested content is ready to be injected into the page  */
        enter: {
            duration: 800,
            start: function ($container, $newContent) {
                System.import('jquery.js').then(function ($) {
                    // Inject the new content
                    $(document.body).scrollTop(0);

                    $container.html($newContent);

                    window.setTimeout(function () {
                        $(document.documentElement).removeClass('is-loading').addClass('is-entering');
                    }, 100);

                    window.setTimeout(function () {
                        transit.after();
                    }, transit.enter.duration);
                });
            }
        },

        /** Run when content has been injected and all animations are complete  */
        after: function () {

            window.App.updateElements();
            if (window.esvibe.app == "true") {
                window.App.captureLinks();
            }
            document.documentElement.classList.remove('is-entering');
            /** Trigger an event so the page can reload requirements */
            window.dispatchEvent(new CustomEvent('viewUpdated'));

        },
        switchMain: function (data) {
            switch (data.type) {
                case "page":
                    return '<article is="esvibe-page" unresolved="true" class="card" the-slug="' + data.slug + '" data-type="' + data.type + '" data-import></article>';
                    break;
                case "post":
                    return '<article is="esvibe-post" unresolved="true" format$="standard" class="card" the-slug="' + data.slug + '" single="true" data-type="' + data.type + '" data-import></article>';
                    break;
                case "category":
                    return '<section is="esvibe-loop" unresolved="true" data-import category="' + data.category + '"></section>';
                    break;
                case "loop":
                    return '<section is="esvibe-loop" unresolved="true" data-import></section>';
                    break;
                default:
                    return 'No resourced found for the request.';
                    break;
            }
        }
    };

    return transit;
}));