"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $.Autoload( this )

function FiberMapper( Fiber ){
    return function fiber_mapper( arg ){
        let racers= []
        for( let key in arg ){
            if( !arg.hasOwnProperty( key ) ) continue
            racers[ key ]= Fiber.apply( this, arg[ key ] )
        }
        return $fenix.FiberRace( racers )
    }
}