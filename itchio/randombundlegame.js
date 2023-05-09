// ==UserScript==
// @name         AHK - Itchio Bundles Check
// @namespace    http://randombundlegame.com
// @version      0.1.1
// @description  Sinalizar jogos do Steam
// @author       You
// @match        https://randombundlegame.com/*
// @icon         https://www.google.com/s2/favicons?domain=randombundlegame.com
// @grant        GM_xmlhttpRequest
// @connect      steampowered.com
// @require http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = window.jQuery;

    var user_data;

    GM_xmlhttpRequest ( {
        method:     'GET',
        url:        'https://store.steampowered.com/dynamicstore/userdata/',
        onload:     function (responseDetails) {
            // DO ALL RESPONSE PROCESSING HERE...
            console.log ("GM_xmlhttpRequest() response is:\n", responseDetails.responseText.substring (0, 80) + '...');
            user_data = JSON.parse( responseDetails.responseText );
        }
    } );

    $('body').on('click', 'button.p-1', function(){
        update_game_data();
    });

    function update_game_data(){
        console.log( user_data.rgOwnedApps );
        $('article > div.mt-auto > a[href*="https://store.steampowered.com"]').each(function(){
            //console.log($(this));
            var link = $(this).attr('href').replace('http://', '').replace('https://', '').replace('store.steampowered.com/app/', '');
            var game_id = link.split('/')[0];

            // owned
            if( user_data.rgOwnedApps.indexOf(Number(game_id)) != -1 ){
                //console.log(game_id);
                //console.log($(this).closest('article').find('h1').text());
                $(this).closest('article').css('background-color', '#7dc110');
            }
            // ignoreds
            if( user_data.rgIgnoredApps.hasOwnProperty(Number(game_id)) ){
                $(this).closest('article').css('opacity', 0.2);
            }
        });
    }

})();