"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
let $fenix= $()

let Json= $fenix.Factory( new function Json( ){
    
    this.init=
    function init( json ){
        if( dom instanceof Json ) return json
        this.raw= function() json
        return this
    }
    
    this.destroy=
    function destroy( ){
        this.raw= null
    }
    
    this.toString=
    function toString( ){
        return JSON.stringify( this.raw() )
    }

})

Json.fromString=
function fromString( text ){
    return Json( JSON.parse( String( text ) ) )
}    

Dom.fromResource=
$fenix.FiberThread( function fromResource( resource ){
    let text= yield resource.get()
    let json= Json.fromString( text )
    yield $fenix.FiberValue( json )
} )
