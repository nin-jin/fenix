"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
let $fenix= $()

function FiberPipe( ){
    let fiberList= arguments
    return $fenix.FiberThread( function executor( ){
        for( var i= 0; i < fiberList.length; ++i ){
            yield fiberList[ i ]
        }
    })
}

