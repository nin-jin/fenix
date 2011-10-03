"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $.Autoload( this )

function FiberMapper( Fiber ){
    return function fiber_mapper( arg ){
        let fibers= []
        for( let key in arg ){
            if( !arg.hasOwnProperty( key ) ) continue
            fibers[ key ]= Fiber.apply( this, arg[ key ] )
        }
        return $fenix.FiberSync( fibers )
    }
}