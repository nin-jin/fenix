"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
let $fenix= $()

let Svn = $fenix.Factory( new function() {
    
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
        let text= yield $fenix.execute( command )
        let dom= $fenix.Dom.fromString( text, $fenix.Uri.fromString( 'system:' + command ).nsIURI() )
        let xml= $fenix.Xml.fromString( dom )
        yield $fenix.FiberValue( xml )
    } )

    this.info=    
    function( ){
        return this.query( 'svn info --xml "' + this.location() + '@"' )
    }

    this.list=
    function( ){
        return this.query( 'svn list --xml "' + this.location() + '@"' )
    }

    this.checkOut=
    function( from ){
        return $fenix.execute( 'svn checkout "' + from + '@" "' + this.location() + '@"' )
    }

    this.update=
    function( ){
        return $fenix.execute( 'svn update "' + this.location() + '@"' )
    }

    this.switchTo=
    function( target ){
        return $fenix.execute( 'svn switch "' + target + '" "' + this.location() + '"' )
    }

    this.status=
    function( ){
        return this.query( 'svn status --xml "' + this.location() + '@"' )
    }

    this.export=
    function( to ){
        return $fenix.execute( 'svn export "' + this.location() + '@" "' + to + '"' )
    }

    this.import=
    function( from, message ){
        return $fenix.execute( 'svn import -m "' + message + '" "'+ from + '" "' + this.location() + '"' )
    }

})
