"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
const $fenix= $( this )

const Fiber= function factory( fiber ){
    return function wrapper( done, fail ){
        if( !done ) done= function(){}
        if( !fail ) fail= $fenix.fail
        try {
            return fiber.call( this, done, fail )
        } catch( exception ){
            fail( exception )
        }
    }
}
