"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $()

const FiberStarter= function( fiber ){
    fiber= $fenix.FiberThread( fiber )
    return function wrapper( ){
        return fiber.apply( this, arguments )()
    }
}
