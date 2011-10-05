"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $( this )

function FiberPipe( ){
    let fiberList= arguments
    return $fenix.FiberThread( function executor( ){
        for( var i= 0; i < fiberList.length; ++i ){
            yield fiberList[ i ]
        }
    })
}

