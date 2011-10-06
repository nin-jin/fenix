"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $()

function FiberMapper( Fiber ){
    return function mapper( arg ){
        let fibers= []
        for( let key in arg ){
            if( !arg.hasOwnProperty( key ) ) continue
            fibers[ key ]= Fiber.apply( this, arg[ key ] )
        }
        return $fenix.FiberSync( fibers )
    }
}