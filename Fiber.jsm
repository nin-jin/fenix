"use strict"
Components.utils.import( 'resource://fenix/this.jsm' )
let $fenix= $()

let Fiber= function factory( fiber ){
    let runAsync= fiber.runAsync
    fiber.runAsync= function wrapper( done, fail ){
        if( !done ) done= function( ){ }
        if( !fail ) fail= function( exception ) $fenix.fail( exception )
        try {
            return runAsync.call( this, done, fail )
        } catch( exception ){
            return fail( exception, done )
        }
    }
    return fiber
}
