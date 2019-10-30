// ==UserScript==
// @name         AHK - Steam Single Add Tags
// @namespace    http://alexkoti.com
// @version      0.1
// @description  Custom user tags shortcut in individual game page.
// @author       Alex Koti
// @match        https://store.steampowered.com/app/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log('single add tags init');

    var $ = window.jQuery;

    var appid = $('.glance_tags.popular_tags').attr('data-appid');
    $('.glance_tags_ctn').append('<p id="my-custom-tags">Custom actions: <br /><span class="app_tag add-custom-tag nice">nice</span><span class="app_tag add-custom-tag masomen">masomen</span><span class="app_tag add-custom-tag Meh">Meh</span><span class="app_tag add-custom-tag Nah">Nah</span><span class="app_tag add-custom-tag Brasil">Brasil</span></p>');

    $('.add-custom-tag').on('click', function(){
        var tag = $(this).text();
        add_custom_tag( tag );
    });


    function add_custom_tag( tag ){
        // custom tag
        var tagurl = 'https://store.steampowered.com/tagdata/tagapp';
        var tdata = {};
        tdata.sessionid = g_sessionID;
        tdata.appid     = appid;
        tdata.tag       = tag;
        console.log(tdata);

        jQuery.post(tagurl, tdata, function(response){
            console.log(response);
            if( response.name ){
                $('.glance_tags').prepend('<span class="app_tag">' + response.name + '</span>');
                $('#my-custom-tags .' + response.name).hide();
            }
        });
    }

})();