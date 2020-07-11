// ==UserScript==
// @name         AHK - Steamgifts Check Ignoreds
// @namespace    https://github.com/alexkoti/steam-userscripts
// @homepage     https://github.com/alexkoti/steam-userscripts
// @version      1.0.0
// @description  In steamgifts, mark all ignored games by user in Steam with red border in eye(hide) button.
// @author       Alex Koti
// @downloadURL  https://github.com/alexkoti/steam-userscripts/raw/master/steamgifts/steamgifts.user.js
// @updateURL    https://github.com/alexkoti/steam-userscripts/raw/master/steamgifts/steamgifts.user.js
// @supportURL   https://github.com/alexkoti/steam-userscripts/issues
// @match        https://www.steamgifts.com/
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
            jQuery('.giveaway__row-inner-wrap:not(.is-faded)').each(function(){
                //console.log( jQuery(this) );
                var game = jQuery(this);
                var link = game.find('.giveaway__icon:first');
                var game_id = link.attr('href').replace('https://store.steampowered.com/app/', '').replace('/', '');
                console.log(game_id);
                if( user_data.rgIgnoredApps.hasOwnProperty(game_id) ){
                    console.log(game_id + ' ignorado');
                    game.find('.giveaway__hide').css('border', '10px solid red');
                }
                else{
                    console.log(game_id + ' ok');
                }

            });
        }
    } );
})();