// Deferred non-critical stylesheet
var loadDeferredStyles = function () {
    var addStylesNode = document.getElementById("esvibe-css");
    var replacement = document.createElement("div");
    replacement.innerHTML = addStylesNode.innerText;
    document.body.appendChild(replacement);
    addStylesNode.parentElement.removeChild(addStylesNode);
};
var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
if (raf) { raf(function () {
    window.setTimeout(loadDeferredStyles, 0);
}) } else  { window.addEventListener('load', loadDeferredStyles) }