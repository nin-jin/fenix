"use strict"

const EXPORTED_SYMBOLS= [ 'EXPORTED_SYMBOLS', '$' ]

const cache= {}

function $( baseURI ){
    if( !baseURI ) baseURI= './'
    if( typeof baseURI === 'string' ){
        baseURI= $io.newURI( baseURI, null, $io.newURI( Components.stack.caller.filename, null, null ) )
    }

    let instance= cache[ baseURI.spec ]
    if( instance ) return instance
    
    let proto=
    new function( ){

        this.$uri=
        function() baseURI
        
        this.$follow=
        function( relativePath ) $( $io.newURI( relativePath, null, baseURI ) )

    }
    
    return cache[ baseURI.spec ]=
    Proxy.create( new function() {

        this.get=
        function( proxy, name ){
            if( name[ 0 ] === '$' ) return proto[ name ]
            let url= baseURI.resolve( name + '.jsm' )
            return $.util.import( url, {} )[ name ]
        }

    })
}

$.klass= Components.classes
$.iface= Components.interfaces
$.util= Components.utils
$.Maker= Components.Constructor

$.util.import( 'resource://gre/modules/XPCOMUtils.jsm' )
const $io= $.klass[ "@mozilla.org/network/io-service;1" ].getService( $.iface.nsIIOService )

$.gre= $( 'resource://gre/modules/' )

$io
.getProtocolHandler( 'resource' )
.QueryInterface( $.iface.nsIResProtocolHandler )
.setSubstitution( 'fenix', $io.newURI( Components.stack.filename.replace( /[^\/]+$/, '' ), null, null ) )

$.util.import( 'resource://fenix/this.jsm' )
