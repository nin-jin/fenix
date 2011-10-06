"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $()

const FiberStarter= function( fiber ){
    return function wrapper( ){
        return fiber.apply( this, arguments )()
    }
}
