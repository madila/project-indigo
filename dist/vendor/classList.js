!function(){function t(t){this.el=t;var n=t.className;n="undefined"==typeof n||"string"!=typeof n?"":n,n=n.replace(/^\s+|\s+$/g,"").split(/\s+/);for(var e=0;e<n.length;e++)i.call(this,n[e])}function n(t,n,e){Object.defineProperty?Object.defineProperty(t,n,{get:e}):t.__defineGetter__(n,e)}if(!("undefined"==typeof window.Element||"classList"in document.documentElement)){var e=Array.prototype,i=e.push,s=e.splice,o=e.join;t.prototype={add:function(t){this.contains(t)||(i.call(this,t),this.el.className=this.toString())},contains:function(t){var n=this.el.className;return n="undefined"==typeof n||"string"!=typeof n?"":n,n.indexOf(t)!=-1},item:function(t){return this[t]||null},remove:function(t){if(this.contains(t)){for(var n=0;n<this.length&&this[n]!=t;n++);s.call(this,n,1),this.el.className=this.toString()}},toString:function(){return o.call(this," ")},toggle:function(t){return this.contains(t)?this.remove(t):this.add(t),this.contains(t)}},window.DOMTokenList=t,n(Element.prototype,"classList",function(){return new t(this)})}}();