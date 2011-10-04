"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $( this )

const Uri= $fenix.Factory( new function() {
    
    this.init=
    function( uri ){
        if( typeof uri === 'string' ) uri= $fenix.service.io.newURI( uri, null, null )
        if( uri instanceof Uri ) uri= uri.nsIURI()
        
        this.nsIURI= function() uri
        
        return this
    }
    
    this.channel=
    function( ){
        return $fenix.Channel( $fenix.service.io.newChannelFromURI( this.nsIURI() ) )
    }
    
    this.file=
    function( ){
        return $fenix.File( this.nsIURI().QueryInterface( $.iface.nsIFileURL ).file )
    }

    this.toString=
    function( ){
        return this.nsIURI().spec
    }
    
})
