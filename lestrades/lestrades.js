// ==UserScript==
// @name         AHK - Lestrades Hide Ignoreds
// @namespace    https://github.com/alexkoti/steam-userscripts
// @homepage     https://github.com/alexkoti/steam-userscripts
// @version      1.0.0
// @description  In lestrades sales, fade all games ignored by user in Steam.
// @author       Alex Koti
// @downloadURL  https://github.com/alexkoti/steam-userscripts/raw/master/lestrades/lestrades.js
// @updateURL    https://github.com/alexkoti/steam-userscripts/raw/master/lestrades/lestrades.js
// @supportURL   https://github.com/alexkoti/steam-userscripts/issues
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

            var visited_link_styling = "<style>.bundle-list a:visited{ color:red; }</style>";
            $('head').append( visited_link_styling );

            var user_data = JSON.parse( responseDetails.responseText );
            var games_list = {};
            //console.log( user_data );
            jQuery('.gamelist .tradable-items li').each(function(){
                //console.log( jQuery(this) );
                var game    = jQuery(this);
                var link    = game.find('a[title="Store page"]');
                if( link.length < 1 ){
                    return true;
                }

                var game_id = link.attr('href').replace('//store.steampowered.com/app/', '').replace('/', '');

                games_list[game_id] = game;

                console.log('-----');
                console.log( game.find('.gdata > strong').text() );

                // ignoreds
                //console.log(game_id);
                if( user_data.rgIgnoredApps.hasOwnProperty(game_id) || game.find('.tbl').length > 0 ){
                    console.log(game_id + ' ignored');
                    game.css('opacity', 0.2);
                }

                // owneds?
                if( game.find('i.tli').length > 0 ){
                    console.log(game_id + ' owned');
                    game.css({
                        'border': '1px solid green',
                        'background-color': 'rgba(0, 128, 0, 0.5)',
                        'opacity' : 1,
                    });
                }

                // banned?
                if( game.find('.cred:contains("↯")').length > 0 ){
                    console.log(game_id + ' owned');
                    game.css({
                        'border-right': '10px solid yellow',
                    });
                }
            });
            console.log(games_list);
        }
    } );
})();