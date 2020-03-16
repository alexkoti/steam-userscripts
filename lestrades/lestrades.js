// ==UserScript==
// @name         AHK - Lestrades Hide Ignoreds
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  In lestrades sales, fade all games ignored by user in Steam.
// @author       Alex Koti
// @match        https://lestrades.com/*
// @grant        GM_xmlhttpRequest
// @connect      steampowered.com
// ==/UserScript==

(function() {
    'use strict';

    GM_xmlhttpRequest ( {
        method:     'GET',
        url:        'https://store.steampowered.com/dynamicstore/userdata/',
        onload:     function (responseDetails) {
            // DO ALL RESPONSE PROCESSING HERE...
            //console.log ("GM_xmlhttpRequest() response is:\n", responseDetails.responseText.substring (0, 80) + '...');

            var user_data = JSON.parse( responseDetails.responseText );
            //console.log( user_data );
            jQuery('.tradable-items li').each(function(){
                //console.log( jQuery(this) );
                var game = jQuery(this);
                var link = game.find('a[title="Store page"]');
                var game_id = link.attr('href').replace('//store.steampowered.com/app/', '').replace('/', '');
                console.log(game_id);
                if( user_data.rgIgnoredApps.hasOwnProperty(game_id) ){
                    console.log(game_id + ' ignorado');
                    game.css('opacity', 0.2);
                }
                else{
                    console.log(game_id + ' ok');
                }
            });
        }
    } );
})();