"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
let $fenix= $()

let Uri= $fenix.Factory( new function Uri( ){
    
    this.init=
    function init( uri ){
        if( uri instanceof Uri ) return uri
        this.nsIURI= function() uri
        return this
    }
    
    this.destroy=
    function destroy( ){
        this.nsIURI= null
    }
    
    this.nsIChannel=
    function nsIChannel( ){
        try {
            return $fenix.service.io.newChannelFromURI( this.nsIURI() )
        } catch( exeption ){
            throw $fenix.extendException( exeption, 'URI: ' + this )
        }
    }

    this.uriReal=
    function uri( ){
        return $fenix.Uri( this.nsIChannel().URI )
    }
    
    this.file=
    function file( ){
        return $fenix.File( this.nsIURI().QueryInterface( $.iface.nsIFileURL ).file )
    }    
    
    this.exists=
    $fenix.FiberValue( true )

    this.get=
    $fenix.FiberThread( function get( ){

        var result= $fenix.FiberTrigger()
        $.gre.NetUtil.asyncFetch( this.nsIChannel(), result.done )
        let [ input, status ]= yield result

        if( !Components.isSuccessCode( status ) ){
            throw new Error( 'Read from [' + this.uriSource() + '] was ended with status [' + status + ']' )
        } 

        let size= input.available()
        let convStream= $fenix.create.converterInput( input, null, size, null )
        try {
            let data= {}
            convStream.readString( size, data )
            yield $fenix.FiberValue( data.value )
        } finally {
            convStream.close();
        } 
    
    } )

    this.go=
    function go( uri ){
        return $fenix.Uri.fromString( this.nsIURI().resolve( uri ) )
    }

    this.fenixResource=
    function fenixResource( ){
        return this
    }
    
    this.toString=
    function toString( ){
        return this.nsIURI().spec
    }
    
})

Uri.fromString=
function( uri ){
    return Uri( $fenix.service.io.newURI( uri, null, null ) )
}