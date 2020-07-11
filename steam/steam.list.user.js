// ==UserScript==
// @name         AHK - Steam Search List Show User Custom Tags
// @namespace    https://github.com/alexkoti/steam-userscripts
// @homepage     https://github.com/alexkoti/steam-userscripts
// @version      1.0.0
// @description  Show custom tags applied by user; show game thumbs below game info (🔄 reload thumbs); show ❌ buttom to ignore game;
// @author       Alex Koti
// @downloadURL  https://github.com/alexkoti/steam-userscripts/raw/master/steam/steam.list.user.js
// @updateURL    https://github.com/alexkoti/steam-userscripts/raw/master/steam/steam.list.user.js
// @supportURL   https://github.com/alexkoti/steam-userscripts/issues
// @match        https://store.steampowered.com/search/*
// @include      https://store.steampowered.com/search/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    //console.log(g_sessionID);
    var $ = window.jQuery;

    function update_user_tags(){
        console.log('update_user_tags');
        $('#search_result_container .search_result_row:not(.ds_owned)').each(function(index){
            var row = $(this);
            // remover mouseover
            row.removeAttr('onmouseover');
            row.removeAttr('onmouseout');

            // altura da linha
            row.css({
                'height' : 'auto',
                'overflow': 'initial'
            });

            var title = row.find('.title').text();
            if( row.is('.ds_wishlist') ){
                console.log( '✨ wishlist:' + title );
                return;
            }
            if( row.is('.ds_owned') ){
                console.log( '✅ owned:' + title );
                return;
            }
            if( row.is('.ds_ignored') ){
                console.log( '❌ ignore:' + title );
                row.hide();
                return;
            }
            var tag_pos = $(this).find('.responsive_search_name_combined p');
            // existe tag de ignore?
            var ignore = $(this).find('.es_tag_notinterested');
            if( ignore.length ){
                console.log( '❌ ignore:' + title );
                return;
            }
            var game_link = row.attr('href');
            var appID     = row.attr('data-ds-appid');
            console.log( '⚡ check: ' + title );
            $.ajax({
                url: game_link,
                type: 'GET',
                dataFilter: function (res, type) {
                    res = res.replace(/<script/ig, '<div class="iscript"').replace(/<\/script>/ig, '</div>');
                    return res;
                },
                success: function(res) {
                    var get_thumbs = true;

                    if( row.find('.title').text() == 'AAAAAA' ){
                        return;
                    }
                    else{
                        //console.log(res);
                        //console.log(1);
                        $(res).find('.iscript').each(function(s){
                            var test = $(this).text();
                            //console.log( $(this).text() );
                            if( test.search('InitAppTagModal') > 0 && test.search('g_eDiscoveryQueueType') == -1 ){
                                //console.log( $(this).text() );
                                //console.log( test );
                                var lines = test.split("\n");
                                //console.log( lines );
                                var user_line = lines[4].replace('],', ']');
                                //console.log( user_line );
                                var user_json = JSON.parse(user_line);
                                //console.log( user_json );
                                if( user_json.length ){
                                    $.each( user_json, function(i, v){
                                        console.warn( title + "\n - Tags encontradas:" );
                                        console.log(v.name);
                                        tag_pos.append('<span class="app_tag">' + v.name + "<span>");

                                        // sinalizar para não pedir thumbs
                                        if( v.name == 'nice' ){
                                            get_thumbs = false;
                                        }
                                    });
                                }
                            }
                        });
                    }

                    // add ignore button ❌
                    var btn_ignore = $('<div class="ignore" style="position: absolute;top: 0;left: -45px;width: 45px;height: 45px;line-height: 42px;text-align: center;font-size: 30px;font-family: monospace;color: #fff;">❌</div>');
                    btn_ignore.on('click', function(event){
                        event.preventDefault();
                        console.log('ignore!');
                        $.ajax({
                            type: "POST",
                            url: 'https://store.steampowered.com/recommended/ignorerecommendation/',
                            dataType: "json",
                            data: {
                                'sessionid' : g_sessionID,
                                'appid'     : appID,
                                'remove'    : 0
                            },
                            success: function(ig_resp){
                                //console.log( ig_resp );
                                if( ig_resp.success == true ){
                                    // hide ignore button
                                    btn_ignore.hide();
                                    // add ignore class
                                    row.addClass('ds_ignored');
                                    // remover thumbs
                                    row.find('.hover_screenshots').remove();
                                }
                            },
                            error: function (xhr, ajaxOptions, thrownError) {
                                alert(xhr.status);
                                alert(thrownError);
                            }
                        });
                    });
                    btn_ignore.appendTo( row );

                    // find game thumbnails
                    if( get_thumbs == true ){
                    console.log('find thumbs');
                    $.ajax({
                        url: 'https://store.steampowered.com/apphover/' + appID,
                        type: 'GET',
                        success: function(gres) {
                            console.log('thumbs!!!');
                            var thumbs = $(gres).find('.hover_screenshots');
                            // hover_screenshots div
                            thumbs.css({
                                //'overflow' : 'hidden',
                                'position' : 'relative',
                                'width'    : '100%',
                                'height'   : '100px',
                                'margin'   : '0 0 30px',
                                'display'  : 'block',
                            });
                            // each screenshot
                            thumbs.find('.screenshot').css({
                                'position'       : 'relative',
                                'width'          : '25%',
                                'height'         : 'auto',
                                'animation'      : 'none',
                                'outline'        : '5px solid #16202d',
                                'outline-offset' : '-5px',
                                'float'          : 'left',
                                'opacity'        : 1
                            }).each(function(){
                                var bg = $(this).css('background-image');
                                bg = bg.replace('url(','').replace(')','').replace(/\"/gi, "");
                                var img = $('<img />');
                                img.attr('src', bg).css('width', '100%');
                                img.appendTo( $(this) );
                                img.error(function(){
                                    var new_src = bg + Date.now();
                                    img.attr('src', new_src);
                                    console.log( 'nova imagem: ' + new_src );
                                });
                            });
                            // append screenshots
                            thumbs.appendTo( row );

                            // botão de remover thumbs ⏹️
                            var remove_thumbs = $('<div class="ignore" style="position: absolute;left: -45px;width: 45px;height: 45px;line-height: 42px;text-align: center;font-size: 30px;font-family: monospace;color: #fff;">⏹️</div>');
                            remove_thumbs.on('click', function(event){
                                event.preventDefault();
                                console.log('stop thumbs! ' + appID);
                                thumbs.remove();
                            }).appendTo( thumbs );

                            // botão reload thumbs 🔄
                            var reload_thumbs = $('<div class="ignore" style="position: absolute;top: 45px;left: -45px;width: 45px;height: 45px;line-height: 42px;text-align: center;font-size: 30px;font-family: monospace;color: #fff;">🔄</div>');
                            reload_thumbs.on('click', function(event){
                                event.preventDefault();
                                console.log('reload thumbs! ' + appID);
                                thumbs.find('.screenshot img').each(function(){
                                    var osrc = $(this).attr('src');
                                    $(this).attr('src', osrc + Date.now());
                                });
                            }).appendTo( thumbs );
                        }
                    });
                    } // get_thumbs

                }
            });
        });
    }

    // init
    setTimeout(function(){
        console.log('init!');
        update_user_tags();
    }, 5000);

    // reload on page change
    $('#search_results').on('click', '.search_pagination_right a', function(){
        console.clear();
        console.log('reload tags!');
        // reload
        setTimeout(function(){
            update_user_tags();
        }, 5000);
    });
})();