// ==UserScript==
// @name         AHK - GGdeals Add to Library
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Quick add game to Epic or Amazon Prime
// @author       Alex Koti
// @match        https://gg.deals/game/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gg.deals
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    var game = jQuery('.game-header-box');
    var game_id = game.attr('data-container-game-id');
    console.log(game_id);

    var token = jQuery('meta[name="csrf-token"]');
    console.log(token.attr('content'));

    var actions = game.find('.game-heading h1');
    jQuery('.breadcrumbs-widget .container').append('<div class="custom-actions"><div class="btn custom-add" data-drm="1">+ STEAM</div><div class="btn custom-add" data-drm="1024">+ EPIC</div><div class="btn custom-add" data-drm="4096">+ AMAZON</div><div class="btn custom-add" data-drm="2">+ EA</div><div class="btn custom-add" data-drm="4">+ UBISOFT</div></div>');
    jQuery('.custom-actions .custom-add').on('click', function(){
        var drm = jQuery(this).attr('data-drm');
        //console.log(drm);
        //console.log(game_id);
        //console.log(token.attr('content'));
        add_custom_tag( game_id, token.attr('content'), drm );
    });

    function add_custom_tag( game_id, token, drm ){
        var tagurl = 'https://gg.deals/collection/single/?id=' + game_id;
        var tdata = {
            gg_csrf: token,
            SingleCollectionForm: {
                drm: drm
            }
        };
        console.log(tdata);

        jQuery.post(tagurl, tdata, function(response){
            console.log(response);
            game.find('.game-info-actions').find('.owned-game .activate').addClass('default-hide');
            game.find('.game-info-actions').find('.owned-game .deactivate').removeClass('default-hide');
        });
    }

})();