// ==UserScript==
// @name         AHK - Lestrades GG Deals Link
// @namespace    https://github.com/alexkoti/steam-userscripts
// @version      1.0.0
// @description  In lestrades sales, link to kinguin search
// @author       Alex Koti
// @match        https://lestrades.com/*
// @grant        GM_xmlhttpRequest
// @connect      steampowered.com
// ==/UserScript==

(function() {
    'use strict';

    // listagem wishlist
    if( $('#glist .gametable') ){
        $('#glist .gametable tr').each(function(index){
            var game = $(this).find('.l a'); //console.log(game);
            if( game.length > 0 ){
                var link = $('<a>ggdeals</a> &nbsp; ');
                link.attr({
                    'href' : 'https://gg.deals/games/?title=' + game.text(),
                    'target' : '_blank',
                    'class' : 'gg-link'
                });
                $(this).find('.floatinfo').after( link );
            }
        });
    }

    // listagem bundle
    if( $('.gamelist .tradable-items') ){
        $('.gamelist .tradable-items li').each(function(){
            var game = $(this).find('a').first(); console.log(game);
            if( game.length > 0 ){
                var link = $('<a>ggdeals</a> &nbsp; ');
                link.attr({
                    'href' : 'https://gg.deals/games/?title=' + game.text(),
                    'target' : '_blank',
                    'class' : 'gg-link'
                });
                link.css('margin', '0 4px 0 -22px');
                $(this).closest('li').find('.ima').append( link );
            }
        });
    }
})();