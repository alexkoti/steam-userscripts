// ==UserScript==
// @name         AHK - Steam Special Page User Tags
// @namespace    https://github.com/alexkoti/steam-userscripts
// @version      1.0.0
// @description  Show custom tags applied by user in SPecial Sales pages
// @author       Alex Koti
// @downloadURL  https://github.com/alexkoti/steam-userscripts/raw/master/steam/steam.list.user.js
// @updateURL    https://github.com/alexkoti/steam-userscripts/raw/master/steam/steam.list.user.js
// @supportURL   https://github.com/alexkoti/steam-userscripts/issues
// @match        https://store.steampowered.com/sale/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    //console.log(g_sessionID);
    var $ = window.jQuery;

    // armazenar ajax requests para invocar o abort();
    var requests = [];

    // armazenar as informações requsitadas via ajax, para reduzir as chamadas externas
    // limitar a quantidade de itens para economizar memória
    var games_info = {};

    // índice de games do cache
    var games_index = [];

    function special_sale_game_info(){
        console.log('special sale!');
        $('._1dKR2IPNQSHs1MAIXBvt_R, ._1dKR2IPNQSHs1MAIXBvt_R').each(function(){

            var game = $(this);

            // link da página individual
            var game_link = game.find('a').attr('href');
            var gameinfo  = game_link.replace('https://store.steampowered.com/app/', '').split('/');
            var appID     = gameinfo[0]
            var gameslug  = gameinfo[1].split('?')[0];
            //console.log(gameinfo);
            //console.log(gameid);
            //console.log(gameslug);

            var tag_pos = game.find('._2bCf9u4rlC8De687HY6wnh');

            // check if is package
            var is_sub = false;
            if( game_link.includes('https://store.steampowered.com/sub/') ){
                is_sub = true;
            }

            if( game.find('._2gxv9cF-4n9wq4yxruOTNl') ){
                console.log( '✅ owned:' + gameslug );
                return;
            }

            if( game.attr('data-request-init') == 1 ){
                console.log('já iniciado');
                return;
            }
            game.attr('data-request-init', 1);

            
            if( !games_info.hasOwnProperty(appID) ){
                console.warn('cadastrar novo appID');
                games_info[appID] = {
                    is_sub : false,
                    tags : [],
                };
                // atualizar cache, limitando espaço
                games_index.push(appID);
                if( games_index.length > 50 ){
                    delete games_info[ games_index[0] ];
                    games_index.shift();
                }

                var request = $.ajax({
                    url: game_link,
                    type: 'GET',
                    dataFilter: function (res, type) {
                        res = res.replace(/<script/ig, '<div class="iscript"').replace(/<\/script>/ig, '</div>');
                        //console.log(res);
                        return res;
                    },
                    success: function(res) {
                        // buscar tags de usuário
                        if( is_sub == false ){
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
                                            games_info[appID]['tags'].push(v.name);
                                            tag_pos.append('<span class="app_tag">' + v.name + "<span>");

                                            // sinalizar para não pedir thumbs
                                            //if( v.name == 'nice' ){
                                            //    get_thumbs = false;
                                            //}
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
                //console.log(request);
                requests.push(request);
            }
            else{
                console.warn('já tem appID, usar cache');
                console.warn(games_info[appID]);
                $.each( games_info[appID]['tags'], function(i, v){
                    tag_pos.append('<span class="app_tag">' + v + "<span>");
                });
            }

        });
    }

    $(document).ready(function(){
         $(document).keypress(function(event){
             if( event.key == 'k' ){
                 special_sale_game_info();
             }
        });
    });

})();