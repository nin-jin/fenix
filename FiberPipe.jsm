"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
let $fenix= $()

function FiberPipe( fiberList ){
    return $fenix.FiberThread( function executor( ){
        for( var i= 0; i < fiberList.length; ++i ){
            yield fiberList[ i ]
        }
    })()
}

