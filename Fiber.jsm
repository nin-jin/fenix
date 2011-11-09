"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
let $fenix= $()

let Fiber= function factory( fiber ){
    return function wrapper( done, fail ){
        if( !done ) done= function( ){ }
        if( !fail ) fail= function( exception ) $fenix.fail( exception )
        try {
            return fiber.call( this, done, fail )
        } catch( exception ){
            fail( exception, done )
        }
    }
}
