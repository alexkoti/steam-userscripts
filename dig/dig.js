// ==UserScript==
// @name         AHK - DIG remove ignoreds
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Alex Koti
// @match        http://www.dailyindiegame.com/
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
            console.log( user_data );
            jQuery('#TableKeys > tr').each(function(){
                //console.log( jQuery(this) );
                var game = jQuery(this);
                var link = game.find('td:nth-child(4) > a:first');
                var game_id = link.attr('href').replace('https://store.steampowered.com/app/', '').replace('/', '');
                console.log(game_id);
                if( user_data.rgIgnoredApps.hasOwnProperty(game_id) ){
                    console.log(game_id + ' ignorado');
                    game.closest('td').css('border', '10px solid red');
                }
                else{
                    console.log(game_id + ' ok');
                }

            });
        }
    } );
})();