// ==UserScript==
// @name         Comixology Hide Owned Free
// @namespace    https://comixology.com/
// @version      0.1
// @description  Esconder quadrinhos já adquiridos da lista de free comics
// @author       You
// @match        https://www.comixology.com/free-comics*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
        console.log('aaaa!');

    var $ = window.jQuery;

    function hide_owneds(){
        console.log('hide!');
        $('.read-action').closest('.content-item').hide();
    }

    // init
    setTimeout(function(){
        console.log('init!');
        hide_owneds();
    }, 2500);

    // reload on page change
    $('.list-container').on('click', '.pager-links a', function(){
        console.clear();
        console.log('reload!');
        // reload
        setTimeout(function(){
            hide_owneds();
        }, 2500);
    });
})();