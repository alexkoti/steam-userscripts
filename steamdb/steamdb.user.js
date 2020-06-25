// ==UserScript==
// @name         AHK - Steamdb Sales Hide Ignoreds
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  In steamdb sales, fade all games ignored by user in Steam.
// @author       Alex Koti
// @match        https://steamdb.info/sales/*
// @grant        GM_xmlhttpRequest
// @connect      steampowered.com
// ==/UserScript==

(function() {
  'use strict';

  var tablesales = GM_xmlhttpRequest ( {
      method:     'GET',
      url:        'https://store.steampowered.com/dynamicstore/userdata/',
      onload:     function (responseDetails) {
          // DO ALL RESPONSE PROCESSING HERE...
          //console.log ("GM_xmlhttpRequest() response is:\n", responseDetails.responseText.substring (0, 80) + '...');

          var user_data = JSON.parse( responseDetails.responseText );
          console.log( user_data );

          var tbl = jQuery('.table-sales');
          observeDOM( tbl[0], function(m){
              //console.log(m);
              tbl.find('.app').each(function(){
                  var game = jQuery(this);
                  //console.log( jQuery(this).attr('data-appid') );
                  var game_id = jQuery(this).attr('data-appid');
                  if( user_data.rgIgnoredApps.hasOwnProperty(game_id) ){
                      console.log('ignorado: ' + game_id);
                      game.css('opacity', 0.2);
                  }
              });
          });
      }
  } );
})();


var observeDOM = (function(){
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

return function( obj, callback ){
  if( !obj || !obj.nodeType === 1 ) return; // validation

  if( MutationObserver ){
    // define a new observer
    var obs = new MutationObserver(function(mutations, observer){
        callback(mutations);
    })
    // have the observer observe foo for changes in children
    obs.observe( obj, { childList:true, subtree:true });
  }

  else if( window.addEventListener ){
    obj.addEventListener('DOMNodeInserted', callback, false);
    obj.addEventListener('DOMNodeRemoved', callback, false);
  }
}
})();