!function(t,e){"function"==typeof define&&define.amd?define(["dist/js/transit.js"],function(n){return t.amdWebGlobal=e(n)}):t.amdWebGlobal=e(t.transit)}(this,function(t){"use strict";return t={data:null,exit:{duration:400,start:function(e){System["import"]("jquery").then(function(n){n("html").addClass("is-exiting"),window.setTimeout(function(){n(document).trigger("esvibe.onExitEnd"),n("html").addClass("is-loading").removeClass("is-exiting"),t.ready.start(window.location.href,e)},t.exit.duration)})}},ready:{duration:400,start:function(e,n){System["import"]("jquery").then(function(e){var i=e("html"),s=e("main"),o=t.switchMain(n);i.hasClass("is-loading")?t.enter.start(s,o):e(document).on("esvibe.onExitEnd",function(){window.setTimeout(t.enter.start(s,o),200)})})}},enter:{duration:800,start:function(e,n){System["import"]("jquery").then(function(i){i("body").scrollTop(0),e.html(n),window.setTimeout(function(){i("html").removeClass("is-loading").addClass("is-entering")},100),window.setTimeout(function(){t.after()},t.enter.duration)})}},after:function(){window.App.updateElements(),"true"==window.esvibe.app&&window.App.captureLinks(),document.documentElement.classList.remove("is-entering"),window.dispatchEvent(new CustomEvent("viewUpdated"))},switchMain:function(t){switch(t.type){case"page":return'<article is="esvibe-page" unresolved="true" class="card" the-slug="'+t.slug+'" data-type="'+t.type+'" data-import></article>';case"post":return'<article is="esvibe-post" unresolved="true" format$="standard" class="card" the-slug="'+t.slug+'" single="true" data-type="'+t.type+'" data-import></article>';case"category":return'<section is="esvibe-loop" unresolved="true" data-import category="'+t.category+'"></section>';case"loop":return'<section is="esvibe-loop" unresolved="true" data-import></section>';default:return"No resourced found for the request."}}}});