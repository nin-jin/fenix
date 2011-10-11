"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $()

const Uri= $fenix.Factory( new function() {
    
    this.init=
    function init( uri ){
        if( typeof uri === 'string' ) uri= $fenix.service.io.newURI( uri, null, null )
        if( uri instanceof Uri ) uri= uri.nsIURI()
        
        this.nsIURI= function() uri
        
        return this
    }
    
    this.channel=
    function channel( ){
        return $fenix.Channel( $fenix.service.io.newChannelFromURI( this.nsIURI() ) )
    }
    
    this.file=
    function file( ){
        return $fenix.File( this.nsIURI().QueryInterface( $.iface.nsIFileURL ).file )
    }
    
    this.follow=
    function follow( relative ){
        return $fenix.Uri( this.nsIURI().resolve( relative ) )
    }

    this.toString=
    function toString( ){
        return this.nsIURI().spec
    }
    
})
