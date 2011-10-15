"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $()

const Svn = $fenix.Factory( new function() {
    
    this.init=
    function init( location ){
        this.location= function( ) location
        return this
    }
    
    this.toString=
    function( ){
        return String( this.location() )
    }
    
    this.query=
    $fenix.FiberThread( function( command ){
        let query= 'svn --xml ' + command
        let text= yield $fenix.execute( query )
        let dom= $fenix.Dom.fromString( text, $fenix.Uri.fromString( 'system:' + query ).nsIURI() )
        let xml= $fenix.Xml.fromString( dom )
        yield $fenix.FiberValue( xml )
    } )

    this.info=    
    function( ){
        return this.query( 'info "' + this.location() + '@"' )
    }

    this.list=
    function( ){
        return this.query( 'list "' + this.location() + '@"' )
    }

    this.checkOut=
    function( from ){
        return this.query( 'checkout "' + from + '@" "' + this.location() + '@"' )
    }

    this.update=
    function( ){
        return this.query( 'update "' + this.location() + '@"' )
    }

    this.status=
    function( ){
        return this.query( 'status "' + this.location() + '@"' )
    }

    this.export=
    function( to ){
        return this.query( 'export "' + this.location() + '@" "' + to + '"' )
    }

    this.import=
    function( from, message ){
        return this.query( 'import -m "' + message + '" "'+ from + '" "' + this.location() + '"' )
    }

})
