"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
let $fenix= $()

let Xml= $fenix.Factory( new function Xml( ){
    
    this.init=
    function init( xml ){
        if( xml instanceof Xml ) return xml
        this.raw= function() xml
        return this
    }
    
    this.destroy=
    function destroy( ){
        this.raw= null
    }
    
    this.toString=
    function toString( ){
        return this.raw().toXMLString()
    }

})

Xml.fromString=
function fromString( text ){
    return Xml( XML( String( text ) ) )
}    

Xml.fromResource=
$fenix.FiberThread( function fromResource( resource, principal ){
    let dom= yield Dom.fromResource( resource, principal )
    let xml= Xml.fromString( dom )
    yield $fenix.FiberValue( xml )
} )
