"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
let $fenix= $()

let FiberStarter= function( Fiber ){
    Fiber= $fenix.FiberThread( Fiber )
    return function wrapper( ){
        return Fiber.apply( this, arguments ).runAsync()
    }
}