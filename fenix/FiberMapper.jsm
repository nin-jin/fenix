"use strict"
Components.utils.import( 'resource://fenix/fenix.jsm' )
const $fenix= $.Autoload( this )

function FiberMapper( fiber ){
  return function fiber_mapper( arg ){
    let racers= []
    for( let key in arg ){
      if( !arg.hasOwnProperty( key ) ) continue
      racers[ key ]= fiber.apply( this, arg[ key ] )
    }
    return $fenix.FiberRace( racers )
  }
}