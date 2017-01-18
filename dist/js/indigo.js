"use strict";System.register([],function(e,t){function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var o,i;return{setters:[],execute:function(){o=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),e("App",i=function(){function e(){n(this,e),this._importedElements=[],window.dispatchEvent(new CustomEvent("appReady")),console.log("App is Ready")}return o(e,[{key:"init",value:function(){this.updateElements(),this.initRouter()}},{key:"initRouter",value:function(){var e=this;Promise.all([System["import"]("director"),System["import"]("router")]).then(function(t){var n=t[0],o=t[1];window.router=n(o.routes).configure(o.routerConfig).init(),console.log("Router Initialised as a window global..."),document.documentElement.className="js",e.captureLinks(),window.dispatchEvent(new CustomEvent("routerReady"))},function(e){console.log(e),console.log("The router couldn't be loaded, default navigation."),window.dispatchEvent(new CustomEvent("routerReady"))})}},{key:"initSocial",value:function(){System["import"]("think-async").then(function(e){e.add("instagram","//platform.instagram.com/en_US/embeds.js",function(){window.addEventListener("viewUpdated",function(e){window.instgrm&&instgrm.Embeds.process()})}),e.add("twitter","//platform.twitter.com/widgets.js",function(e){})})}},{key:"lazyLoadElements",value:function(e){e=void 0==e?[].slice.call(document.querySelectorAll("[data-import]")):e;var t=this;e.forEach(function(e){var n=void 0,o=new RegExp(" +","g");if(n=e.hasAttribute("is")?e.getAttribute("is").replace(o,"-").toLowerCase():e.tagName.replace(o,"-").toLowerCase(),t.importedElements.indexOf(n)==-1){var i=document.createElement("link"),r=e.dataset["import"];i.rel="import",""==r?i.href=window.indigo.components_url+n+".html":i.href=window.indigo.components_url+r,document.head.appendChild(i),t.importedElements=n}})}},{key:"updateElements",value:function(e){e=void 0==e?[].slice.call(document.querySelectorAll("[data-import]")):e,e.length>0&&this.lazyLoadElements(e)}},{key:"onClickEventHandler",value:function(e){if(console.log("System is handling link event"),e.target.href.indexOf(window.indigo.site_url)>-1){e.preventDefault(),console.log("router");var t=e.target;t.href!==window.location.href&&window.router.setRoute(e.target.href)}}},{key:"captureLinks",value:function(e){e=void 0==e?document.querySelectorAll("a[href]"):e;for(var t in e)if(e[t]instanceof Node&&"#"!==e[t].getAttribute("href")){if(e[t].hasAttribute("data-prevent-default"))e[t].addEventListener("click",function(e){e.preventDefault()});else{if(e[t].attached)continue;e[t].addEventListener("click",this.onClickEventHandler),e[t].attached=!0}console.log(e[t])}}},{key:"importedElements",get:function(){return this._importedElements},set:function(e){this._importedElements.push(e)}}],[{key:"getCustomElementName",value:function(e){return e.replace(/ +/g,"-").toLowerCase()}}]),e}()),e("App",i)}}});