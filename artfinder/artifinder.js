// ==UserScript==
// @name         AHK - Artfinder Highlights
// @namespace    artfinder
// @version      0.1
// @description  Highlight sold itens and more
// @author       You
// @match        https://www.artfinder.com/*
// @icon         https://www.google.com/s2/favicons?domain=artfinder.com
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

(function() {
    'use strict';

    var observeDOM = (function(){
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        return function( obj, callback ){
            if( !obj || !obj.nodeType === 1 ) return; // validation

            if( MutationObserver ){
                // define a new observer
                var obs = new MutationObserver(function(mutations, observer){
                    callback(mutations);
                })
                // have the observer observe foo for changes in children
                obs.observe( obj, { childList:true, subtree:true });
            }

            else if( window.addEventListener ){
                obj.addEventListener('DOMNodeInserted', callback, false);
                obj.addEventListener('DOMNodeRemoved', callback, false);
            }
        }
    })();

    var tbl = jQuery('.masonry-gallery');
    observeDOM( tbl[0], function(m){
        //console.log(m);
        highlight_sold();
    });

    function highlight_sold(){
        console.log('highlight_sold');
        jQuery('.product-tag-sold').closest('.product-card').css({
            'border': '2px solid #ff0000',
            'box-shadow': '0 0 10px #ff0000',
        });
    }

})();


