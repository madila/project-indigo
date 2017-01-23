(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['router.js'], function (appRouter) {
            // Also create a global in case some scripts
            // that are loaded still are looking for
            // a global even when an AMD loader is in use.
            return (root.amdWebGlobal = factory(appRouter));
        });
    } else {
        // Browser globals
        root.amdWebGlobal = factory(root.appRouter);
    }
}(this, function(appRouter) {

    // Routing config and functions
    var routing = {
        category: function (category) {
            "use strict";
            var routeData = {
                "category" : category,
                "type" : "post"
            };
            appRouter.callTransit(routeData);
        },
        page: function (slug) {
            "use strict";
            var routeData = {
                "slug" : slug,
                "type" : "page"
            };
            appRouter.callTransit(routeData);
        },
        news: function (slug) {
            "use strict";
            var routeData = {
                "slug" : slug,
                "type" : "post"
            };
            appRouter.callTransit(routeData);
        },
        index: function () {
            "use strict";
            var routeData = {
                "type" : "loop"
            };
            appRouter.callTransit(routeData);
        }
    };

    // Functions to handle the json response
    appRouter.routes = {
        '/categoria/:category': 'category',
        '/:slug/': 'news',
        '/paginas/:slug/': 'page',
        '': 'index'
    };

    appRouter.routerConfig = {
        html5history: true,
        strict: false,
        run_handler_in_init: false,
        resource: routing
    };


    appRouter.callTransit = function(routeData) {
        "use strict";
        System.import('transit.js').then(function(transit) {
            transit.exit.start(routeData);
        });
    };

    return appRouter;

}));