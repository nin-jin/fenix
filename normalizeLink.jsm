"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $()

function normalizeLink( link ){
    return String( link )
    .replace
    (   /^((?:f|ht)tps?:\/\/)([^\/]+)(\/.*)/
    ,   function( link, prefix, domain, postfix ){
            return prefix + $fenix.service.idn.convertUTF8toACE( domain ) + postfix
        }
    )
}
