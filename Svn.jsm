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
        let text= yield $fenix.execute( 'svn --xml ' + command )
        let xml= $fenix.Dom.fromXMLString( text ).toXML()
        yield $fenix.FiberValue( xml )
    } )

    this.info=    
    function( ){
        return this.query( 'info "' + this.location() + '@head"' )
    }

    this.list=
    function( ){
        return this.query( 'list "' + this.location() + '@head"' )
    }

    this.checkOut=
    function( from ){
        return this.query( 'checkout "' + from + '@head" "' + this.location() + '@head"' )
    }

    this.update=
    function( ){
        return this.query( 'update "' + this.location() + '@head"' )
    }

    this.status=
    function( ){
        return this.query( 'status "' + this.location() + '@head"' )
    }

    this.export=
    function( to ){
        return this.query( 'export "' + this.location() + '@head" "' + to + '"' )
    }

    this.import=
    function( from, message ){
        return this.query( 'import -m "' + message + '" "'+ from + '" "' + this.location() + '"' )
    }

})
