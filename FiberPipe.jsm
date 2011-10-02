"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $.Autoload( this )

function FiberPipe( ){
    let fiberList= arguments
    return $fenix.Thread( function( ){
        for( var i= 0; i < fiberList.length; ++i ){
            yield fiberList[ i ]
        }
    })
}

