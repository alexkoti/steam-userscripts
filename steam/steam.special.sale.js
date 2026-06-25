// ==UserScript==
// @name         AHK - Steam Special Page User Tags
// @namespace    https://github.com/alexkoti/steam-userscripts
// @version      1.1.0
// @description  Show custom tags applied by user in SPecial Sales pages
// @author       Alex Koti
// @downloadURL  https://github.com/alexkoti/steam-userscripts/raw/master/steam/steam.list.user.js
// @updateURL    https://github.com/alexkoti/steam-userscripts/raw/master/steam/steam.list.user.js
// @supportURL   https://github.com/alexkoti/steam-userscripts/issues
// @match        https://store.steampowered.com/sale/*
// @match        https://store.steampowered.com/curator/*
// @match        https://store.steampowered.com/developer/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    //console.log(g_sessionID);
    var $ = window.jQuery;

    var games_limit = 60;

    // armazenar ajax requests para invocar o abort();
    var requests = [];

    // cache das tags dos jogos individuais
    var cache = JSON.parse(localStorage.getItem('game_tags_cache'));
    var game_tags_cache = {};
    if( cache !== null ){
        game_tags_cache = cache.data;
    }

    // armazenar as informações requsitadas via ajax, para reduzir as chamadas externas
    // limitar a quantidade de itens para economizar memória
    var games_info = {};

    // índice de games do cache
    var games_index = [];

    function special_sale_game_info(){
        console.log('special sale!');
        console.log('game_tags_cache:');
        console.log(game_tags_cache);

        $('._1dKR2IPNQSHs1MAIXBvt_R, ._3r4Ny9tQdQZc50XDM5B2q2, ._1_P15GG6AKyF_NMX2j4-Mu').each(function(){

            var game = $(this);
            //console.log(game);

            // link da página individual
            var game_link = game.find('a').attr('href');
            var gameinfo  = game_link.replace('https://store.steampowered.com/app/', '').split('/');
            var appID     = gameinfo[0]
            var title  = gameinfo[1].split('?')[0];
            //console.log(gameinfo);
            //console.log(gameid);
            //console.log(title);

            var tag_html = game.find('._2bCf9u4rlC8De687HY6wnh');
            var tag_pos  = 'append';
            console.log(tag_html);
            // _3a6HRK-P6LK0-pxRKXYgyP > parent dos ícones de sistema operacional
            if( tag_html.length == 0 ){
                tag_html = game.find('.hover.div, .CapsuleBottomBar');
                tag_pos = 'prepend';
            }
            console.log(tag_pos);
            //console.log(tag_html);

            // check if is package
            var is_sub = false;
            if( game_link.includes('https://store.steampowered.com/sub/') ){
                is_sub = true;
            }

            //if( game.find('._2o-5t6bgEJxfbWVSmxT88V') ){
            //    console.log( game );
            //    console.log( '✅ owned:' + title );
            //    return;
            //}

            if( game.attr('data-request-init') == 1 ){
                console.log('já iniciado');
                return;
            }
            game.attr('data-request-init', 1);

            if( !game_tags_cache.hasOwnProperty(appID) ){
                //console.log('Talvez buscar novo appID');
                //game_tags_cache[appID] = {
                //    is_sub : false,
                //    tags : [],
                //};

                // limitar requisições
                games_index.push(appID);
                if( games_index.length > games_limit ){
                    console.log('limite de games');
                }
                else{
                    console.warn('Buscar novo appID', appID);
                    //console.log(gameinfo);

                    /* */
                    requests.push(
                        $.ajax({
                            url: game_link,
                            type: 'GET',
                            cache: true,
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

                                            // iniciar vazio para não pedir novamente depois
                                            game_tags_cache[appID] = {
                                                is_sub : false,
                                                tags : [],
                                            };
                                            // guardar tags para salvar
                                            if( user_json.length ){
                                                temp_tags = '<span style="height:38px;display:flex;align-items:center;">';
                                                $.each( user_json, function(i, v){
                                                    console.warn( title + "\n - Tags encontradas:" );
                                                    console.log(v.name);
                                                    var temp_tags = '';
                                                    game_tags_cache[appID]['tags'].push(v.name);
                                                    //console.log(tag_html);
                                                    //tag_html[tag_pos]('<span class="app_tag">' + v.name + "<span>");
                                                    temp_tags += '<span class="app_tag">' + v + "</span>";

                                                    // sinalizar para não pedir thumbs
                                                    //if( v.name == 'nice' ){
                                                    //    get_thumbs = false;
                                                    //}
                                                });
                                                temp_tags += '</span>';
                                                tag_html[tag_pos]( temp_tags );
                                            }
                                        }
                                    });
                                }
                            }
                        })
                    );
                    //console.log(request);
                    //requests.push(request);
                    /* */
                }

            }
            else{
                console.warn('já tem appID, usar cache');
                //console.log(game_tags_cache);
                //console.warn(game_tags_cache[appID]);
                //console.log('elemento das tags:');
                //console.log(tag_html);
                var temp_tags = '';
                temp_tags = '<span style="height:38px;display:flex;align-items:center;">';
                $.each( game_tags_cache[appID]['tags'], function(i, v){
                    temp_tags += '<span class="app_tag">' + v + "</span>";
                });
                temp_tags += '</span>';
                console.log(temp_tags);
                tag_html[tag_pos]( temp_tags );
            }

        });

        $.when.apply($, requests).always(function() {
            console.log('START SAVE STORAGE');
            console.log('Todas terminaram (com sucesso ou erro)');
            console.log('game_tags_cache:');
            console.log(game_tags_cache);
            localStorage.setItem('game_tags_cache', JSON.stringify({
                expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week
                data: game_tags_cache
            }))
        });

        //console.log(games_index);

        //localStorage.setItem('game_tags_cache', JSON.stringify({
        //    expires: Date.now() + 7 * 24 * 60 * 60 * 1000 // 1 week
        //    data: game_tags_cache
        //}));
    }

    $(document).ready(function(){
        // sinalizar no topo da página o comando:
        jQuery('body').append('<div style="position:fixed;top:0;left:0;padding:10px;background:red;color:#fff;z-index:999;">buscar tags com K</div>');

        // acionar apenas quando apertar K
         $(document).keypress(function(event){
             if( event.key == 'k' ){
                 special_sale_game_info();
             }
        });
    });

})();