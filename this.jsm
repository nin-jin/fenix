"use strict"

const EXPORTED_SYMBOLS= [ 'EXPORTED_SYMBOLS', '$' ]


const $= this.Proxy ? AutoloadFF4 : AutoloadFF3

$.klass= Components.classes
$.iface= Components.interfaces
$.util= Components.utils
$.Maker= Components.Constructor

$.util.import( 'resource://gre/modules/XPCOMUtils.jsm' )
const $io= $.klass[ "@mozilla.org/network/io-service;1" ].getService( $.iface.nsIIOService )

const cache= {}

$.gre= $( 'resource://gre/modules/' )

function AutoloadFF4( baseURI ){
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

function AutoloadFF3( baseURI ){
    if( !baseURI ) baseURI= './'
    if( typeof baseURI === 'string' ){
        baseURI= $io.newURI( baseURI, null, $io.newURI( Components.stack.caller.filename, null, null ) )
    }
    
    let instance= cache[ baseURI.spec ]
    if( instance ) return instance
    
    return cache[ baseURI.spec ]= new function( ){

        let aDir= baseURI.QueryInterface( $.iface.nsIFileURL ).file

        let i = aDir.directoryEntries
        while( i.hasMoreElements() ){
            let file= i.getNext().QueryInterface( $.iface.nsIFile )
            if( !file.isFile() ) continue

            let name= file.leafName.replace( /\.jsm$/, '' )
            if( name === file.leafName ) continue
            
            XPCOMUtils.defineLazyGetter( this, name, function( ){
                let url= $io.newFileURI( file ).spec
                return $.util.import( url, {} )[ name ]
            } )

        }
        
        this.$uri=
        function() baseURI
        
        this.$follow=
        function( relativePath ) $( $io.newURI( relativePath, null, baseURI ) )
        
    }
}
